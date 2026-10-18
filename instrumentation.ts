export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.DISABLE_VECTOR_INDEX === "true") return;

  try {
    const { ensureVectorIndexes } = await import("@/lib/vector-index");
    await ensureVectorIndexes();
  } catch (error) {
    console.error(
      "[instrumentation] failed to ensure vector indexes:",
      error instanceof Error ? error.message : error,
    );
  }
}
