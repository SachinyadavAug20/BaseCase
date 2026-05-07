"use server";

import {
  createQuestionParams,
  editQuestionParams,
  getQuestionParams,
} from "@/types/action";
import {
  ActionResponse,
  ErrorResponse,
  IQuestion,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  getQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import handleError from "../handlers/error";
import mongoose, { FilterQuery, Mongoose } from "mongoose";
import Question, { IQuestionDoc } from "@/dataBase/question.model";
import { throws } from "assert";
import Tag, { ITag, ITagDoc } from "@/dataBase/tag.model";
import TagQuestion from "@/dataBase/tag-question.model";
import { NotFoundError } from "../http-error";
import { TypeOf } from "zod";
import { SofaIcon } from "lucide-react";

export async function createQuestion(
  params: createQuestionParams,
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult", validationResult);
  const userId = validationResult?.session?.user?.id;
  const { title, content, tags } = validationResult.params!;
  // as need to update tag count and ref so need to start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newQuestion] = await Question.create(
      [{ title, content, author: userId }],
      { session },
    );
    if (!newQuestion) throw new Error("Failed to create question");
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // serarch by name case insensitive
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } }, // if not found create and if fount increment question by 1
        { upsert: true, new: true, session },
      ); // optional params
      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: newQuestion._id,
      });
    }
    // push to DB
    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findOneAndUpdate(
      newQuestion._id,
      { $push: { tags: { $each: tagIds } } },
      { session },
    );
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(newQuestion)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editQuestion(
  params: editQuestionParams,
): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult", validationResult);
  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  // as need to update tag count and ref so need to start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId).populate("tags"); // no mutation action so no sersion added
    if (!question) throw new NotFoundError("Question");
    if (question.author.toString() !== userId)
      throw new Error("You are not allowed to edit this question");
    if (question.title !== title) question.title = title;
    if (question.content !== content) question.content = content;
    await question.save({ session });

    const tagstoAdd = tags.filter(
      (tag) =>
        !question.tags.some((t: ITagDoc) =>
          t.name.toLowerCase().includes(tag.toLowerCase()),
        ),
    );
    const tagstoRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()),
    );

    const newTagDocument = [];
    if (tagstoAdd.length > 0) {
      for (const tag of tagstoAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );
        if (existingTag) {
          newTagDocument.push({ tag: existingTag._id, question: questionId });
          question.tags.push(existingTag);
        }
      }
    }
    if (tagstoRemove.length > 0) {
      const tagIdsToRemove = tagstoRemove.map(
        (tag: mongoose.Types.ObjectId) => tag._id,
      );
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session },
      );
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id),
          ),
      );
    }
    if (newTagDocument.length > 0) {
      await TagQuestion.insertMany(newTagDocument, { session });
    }
    await question.save({ session });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getQuestion(
  params: getQuestionParams,
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: getQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult", validationResult);
  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new NotFoundError("Question");
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: IQuestion[]; isNext: boolean }>> {
  // search question result
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Question> = {};
  if (filter == "recomended")
    return { success: true, data: { questions: [], isNext: false } }; // skip recomended system
  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }
  let sortCriteria = {};
  // here filter and sort means same thing
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }
  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
