import Answers from "@/dataBase/answer.model";
import Question from "@/dataBase/question.model";
import Tag, { ITagDoc } from "@/dataBase/tag.model";
import type { Types } from "mongoose";
import { EMBEDDING_MODEL, embedTexts } from "@/lib/embedding";

const buildText = (parts: (string | undefined)[]) =>
  parts.filter(Boolean).join("\n").trim();

export async function embedQuestion(questionId: string): Promise<boolean> {
  try {
    const question = await Question.findById(questionId).populate("tags", "name");
    if (!question) return false;

    const embedding = (
      await embedTexts([
        buildText([
          question.title,
          (question.tags as ITagDoc[]).map((tag) => tag.name).join(", "),
          question.content,
        ]),
      ])
    )?.[0];

    if (!embedding) return false;

    await Question.findByIdAndUpdate(questionId, {
      $set: { embedding, embeddingModel: EMBEDDING_MODEL },
    });
    return true;
  } catch (error) {
    console.error(`Embedding question ${questionId} failed:`, error);
    return false;
  }
}

export async function embedAnswer(answerId: string): Promise<boolean> {
  try {
    const answer = await Answers.findById(answerId).populate<{
      question: { title: string; tags: Types.ObjectId[] } | null;
    }>("question", "title tags");
    if (!answer) return false;

    const tagNames = answer.question
      ? await Tag.find({ _id: { $in: answer.question.tags } }, "name")
      : [];

    const embedding = (
      await embedTexts([
        buildText([
          answer.question?.title,
          tagNames.map((tag) => tag.name).join(", "),
          answer.content,
        ]),
      ])
    )?.[0];

    if (!embedding) return false;

    await Answers.findByIdAndUpdate(answerId, {
      $set: { embedding, embeddingModel: EMBEDDING_MODEL },
    });
    return true;
  } catch (error) {
    console.error(`Embedding answer ${answerId} failed:`, error);
    return false;
  }
}
