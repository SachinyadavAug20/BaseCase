/**
 * Backfills embeddings for existing questions and answers.
 *
 * Run once after setting OPENROUTER_API_KEY:
 *   node --env-file=.env.local scripts/backfill-embeddings.mjs
 */
import { MongoClient } from "mongodb";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/embeddings";
const MODEL = process.env.EMBEDDING_MODEL || "nvidia/nemotron-3-embed-1b:free";
const BATCH_SIZE = 16;
const MAX_TEXT_CHARS = 8000;
const MAX_RETRIES = 4;

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is missing");

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

const truncate = (t) =>
  !t ? "" : t.length > MAX_TEXT_CHARS ? t.slice(0, MAX_TEXT_CHARS) : t;

const joinText = (parts) =>
  parts.filter(Boolean).join("\n").trim();

async function embedBatch(texts) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, input: texts }),
    });

    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_RETRIES) throw new Error(`OpenRouter ${res.status}`);
      const wait = 2000 * 2 ** attempt;
      console.log(`  ${res.status}, retrying in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
  }
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME || "devflow");

// shared lookups
const tagNamesById = new Map();
for (const tag of await db.collection("tags").find({}).toArray()) {
  tagNamesById.set(String(tag._id), tag.name);
}
const questionTexts = new Map();
for (const q of await db.collection("questions").find({}).toArray()) {
  questionTexts.set(
    String(q._id),
    joinText([
      q.title,
      (q.tags ?? []).map((id) => tagNamesById.get(String(id)) ?? "").filter(Boolean).join(", "),
      q.content,
    ]),
  );
}

const textsFor = {
  questions: (doc) => joinText([doc.title, (doc.tags ?? []).map((id) => tagNamesById.get(String(id)) ?? "").filter(Boolean).join(", "), doc.content]),
  answers: (doc) => joinText([doc.question ? questionTexts.get(String(doc.question)) : "", doc.content]),
};

async function backfill(collectionName) {
  const collection = db.collection(collectionName);
  const query = { embedding: { $exists: false } };
  const total = await collection.countDocuments(query);
  console.log(`[${collectionName}] ${total} documents to embed`);
  if (total === 0) return 0;

  let done = 0;
  let batch = [];
  const flush = async () => {
    if (batch.length === 0) return;
    const docs = batch;
    const texts = docs.map((d) => d.text);
    const embeddings = await embedBatch(texts);

    const operations = docs.map((d, i) => ({
      updateOne: {
        filter: { _id: d._id },
        update: { $set: { embedding: embeddings[i], embeddingModel: MODEL } },
      },
    }));
    await collection.bulkWrite(operations);
    done += docs.length;
    console.log(`[${collectionName}] ${done}/${total}`);
    batch = [];
  };

  // fetch full docs one by one so texts can join across collections
  for (const doc of await collection.find(query).toArray()) {
    const text = truncate(textsFor[collectionName](doc));
    if (!text) continue;
    batch.push({ _id: doc._id, text });
    if (batch.length >= BATCH_SIZE) {
      await flush();
      await new Promise((r) => setTimeout(r, 250)); // stay under free-tier rate limits
    }
  }
  await flush();
  return done;
}

await backfill("questions");
await backfill("answers");
await client.close();
console.log("Backfill complete");
