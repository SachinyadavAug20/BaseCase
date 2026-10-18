const OPENROUTER_URL = "https://openrouter.ai/api/v1/embeddings";

export const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || "nvidia/nemotron-3-embed-1b:free";

export const EMBEDDING_DIMENSIONS = Number(
  process.env.EMBEDDING_DIMENSIONS || 2048,
);

// free model context is 32k tokens; 8k chars is a safe budget per text
const MAX_TEXT_CHARS = 8000;
const MAX_RETRIES = 3;

interface EmbeddingResponse {
  data?: { embedding: number[]; index: number }[];
  error?: { message: string };
}

// small in-memory cache so debounced searches don't re-embed the same query
const vectorCache = new Map<string, number[]>();
const CACHE_LIMIT = 200;

const truncateText = (text: string) =>
  text.length > MAX_TEXT_CHARS ? text.slice(0, MAX_TEXT_CHARS) : text;

export async function embedTexts(input: string[]): Promise<number[][] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || input.length === 0) return null;

  const texts = input.map(truncateText);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
      });

      if (res.status === 429 || res.status >= 500) {
        throw new Error(`OpenRouter embeddings ${res.status}`);
      }

      const json = (await res.json()) as EmbeddingResponse;
      if (json.error || !json.data) {
        throw new Error(json.error?.message || "No embedding data returned");
      }

      return json.data
        .sort((a, b) => a.index - b.index)
        .map((item) => item.embedding);
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error("Embedding request failed after retries:", error);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
  return null;
}

export async function embedText(text: string): Promise<number[] | null> {
  const cacheKey = `${EMBEDDING_MODEL}:${text}`;
  const cached = vectorCache.get(cacheKey);
  if (cached) return cached;

  const embeddings = await embedTexts([text]);
  if (!embeddings) return null;

  if (vectorCache.size >= CACHE_LIMIT) {
    vectorCache.delete(vectorCache.keys().next().value as string);
  }
  vectorCache.set(cacheKey, embeddings[0]);
  return embeddings[0];
}
