import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { VECTOR_INDEX_NAME } from "@/lib/embedding/vector-search";

const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS || 2048);

const vectorIndexDefinition = {
  name: VECTOR_INDEX_NAME,
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: EMBEDDING_DIMENSIONS,
        similarity: "cosine",
      },
    ],
  },
};

let ensured: Promise<void> | null = null;

/**
 * Creates the Atlas Vector Search indexes (questions + answers) if missing.
 * Idempotent and cached per process — safe to call on every server boot.
 * Set DISABLE_VECTOR_INDEX=true to skip (e.g. local non-Atlas MongoDB).
 */
export async function ensureVectorIndexes(): Promise<void> {
  if (process.env.DISABLE_VECTOR_INDEX === "true") return;
  if (!process.env.OPENROUTER_API_KEY) return;

  if (!ensured) {
    ensured = doEnsure().catch((error) => {
      // allow a retry on next boot/cache-clean instead of caching the failure
      ensured = null;
      throw error;
    });
  }
  return ensured;
}

async function doEnsure(): Promise<void> {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not initialised");

  for (const collection of ["questions", "answers"]) {
    try {
      await db.command({
        createSearchIndexes: collection,
        indexes: [vectorIndexDefinition],
      });
      console.log(`[vector-index] created '${VECTOR_INDEX_NAME}' on ${collection}`);
    } catch (error) {
      const message = String((error as Error)?.message ?? error);
      if (/already exists/i.test(message)) {
        console.log(`[vector-index] '${VECTOR_INDEX_NAME}' on ${collection} already exists`);
      } else if (/CommandNotFound|invalid command|not authorized|not supported/i.test(message)) {
        console.warn(
          `[vector-index] skipped creating index on ${collection}: ${message}. ` +
            "Vector search requires MongoDB Atlas. Falling back to regex search at runtime.",
        );
        return;
      } else {
        throw error;
      }
    }
  }
}
