import Question, { IQuestion } from "@/dataBase/question.model";
import Answers from "@/dataBase/answer.model";
import { PipelineStage, Types } from "mongoose";
import { EMBEDDING_DIMENSIONS, embedText } from "@/lib/embedding";

export const VECTOR_INDEX_NAME = "vector_index";

interface ScoredQuestionDoc {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  views?: number;
  upvotes?: number;
  downvotes?: number;
  answers?: number;
  createdAt?: string;
  score: number;
}

interface ScoredAnswerDoc {
  _id: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  score: number;
}

type MongoFilter = Record<string, unknown>;

/**
 * Semantic (fuzzy) search over questions using MongoDB Atlas Vector Search.
 * Falls back gracefully — callers should treat `null` as "no semantic results"
 * and use the leaf regex search as fallback.
 */
export async function semanticQuestionSearch({
  query,
  skip = 0,
  limit = 10,
  filter,
}: {
  query: string;
  skip?: number;
  limit?: number;
  filter?: string;
}): Promise<{ questions: IQuestion[]; isNext: boolean } | null> {
  try {
    const queryVector = await embedText(query);
    if (!queryVector || queryVector.length !== EMBEDDING_DIMENSIONS) return null;

    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector,
          numCandidates: Math.max(200, skip + limit * 2),
          limit: skip + limit,
        },
      } as PipelineStage,
      { $addFields: { score: { $meta: "vectorSearchScore" } } },
    ];

    // keep filter behaviour from the leaf search, ordered inside the relevant window
    if (filter === "unanswered") {
      pipeline.push({ $match: { answers: 0 } });
    } else if (filter === "popular") {
      pipeline.push({ $sort: { upvotes: -1, score: -1 } });
    }

    // $vectorSearch `limit` caps the candidate window at skip + limit;
    // keeping the whole window lets us both paginate and detect "more pages"
    pipeline.push({ $project: { score: 0 } });

    const scored = await Question.aggregate<ScoredQuestionDoc>(
      pipeline as unknown as PipelineStage[],
    );
    const page = scored.slice(skip, skip + limit);

    const ids = page.map((doc) => doc._id);
    const found = await Question.find({ _id: { $in: ids } })
      .populate("tags", "name")
      .populate("author", "name image")
      .lean();
    const scoreById = new Map(scored.map((doc) => [String(doc._id), doc.score]));
    const questions = JSON.parse(
      JSON.stringify(
        found.sort(
          (a, b) =>
            (scoreById.get(String(b._id)) ?? 0) -
            (scoreById.get(String(a._id)) ?? 0),
        ),
      ),
    );

    // window fully saturated => possibly more relevant results
    const isNext = scored.length >= skip + limit;
    return { questions, isNext };
  } catch (error) {
    console.error("Semantic question search failed:", error);
    return null;
  }
}

/** Semantic search over answers (used by global search). */
export async function semanticAnswerSearch(
  query: string,
  limit = 8,
): Promise<{ _id: string; question: string; content: string; score: number }[] | null> {
  try {
    const queryVector = await embedText(query);
    if (!queryVector || queryVector.length !== EMBEDDING_DIMENSIONS) return null;

    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector,
          numCandidates: Math.max(200, limit * 2),
          limit,
        },
      } as PipelineStage,
      { $addFields: { score: { $meta: "vectorSearchScore" } } },
      { $project: { question: 1, content: 1, score: 1 } },
    ];

    const results = await Answers.aggregate<ScoredAnswerDoc>(
      pipeline as unknown as PipelineStage[],
    );
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.error("Semantic answer search failed:", error);
    return null;
  }
}
