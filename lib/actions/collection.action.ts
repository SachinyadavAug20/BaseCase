"use server";

import { CollectionBaseParams } from "@/types/action";
import {
  ActionResponse,
  CollectionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import {
  CollectionBasedSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import handleError from "../handlers/error";
import { Collection, Question } from "@/dataBase";
import { NotFoundError } from "../http-error";
import ROUTES from "@/constant/routes";
import { revalidatePath } from "next/cache";
import { Mongoose, Types } from "mongoose";
import { title } from "process";

export async function toggleSaveQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBasedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  try {
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");
    const collection = await Collection.findOne({
      author: userId,
    });
    if (collection) {
      // if collection exist check question
      const hasQuestion = collection.questions.includes(questionId);
      if (hasQuestion) {
        collection.questions = collection.questions.filter(
          (id: Types.ObjectId) => id.toString() !== questionId,
        );
        await collection.save();
        revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`);
        return { success: true, data: { saved: false } };
      } else {
        collection.questions.push(questionId);
        await collection.save();
        revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`);
        return { success: true, data: { saved: true } };
      }
    }
    await Collection.create({
      author: userId,
      questions: questionId,
    });
    revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`);
    return { success: true, data: { saved: true } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBasedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  try {
    const collection = await Collection.findOne({
      author: userId,
    });
    if (collection) {
      const hasQuestion = collection.questions.includes(questionId);
      return { success: true, data: { saved: !!hasQuestion } }; // !! used to convert to boolean
    } else {
      return { success: true, data: { saved: false } }; // !! used to convert to boolean
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams,
): Promise<
  ActionResponse<{ Collection?: CollectionResponse; isNext: boolean }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { createdAt: -1 },
    oldest: { createdAt: 1 },
    mostupvoted: { upvotes: -1 },
    mostviewed: { views: -1 },
    mostanswered: { answers: -1 },
  };
  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || { createdAt: -1, };
  const searchQuery = query
    ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  try {
    const collection = await Collection.findOne({
      author: userId,
    });

    // .populate({
    //   path: "questions",
    //   match: searchQuery,
    //   options: { sort: sortCriteria, skip, limit },   // inefficent do direct query on Question DB
    // });

    if (!collection) {
      return { success: true, data: { Collection: {_id: "", author: "", questions: []}, isNext: false } };
    }

    const totalCount = await Question.countDocuments({_id:{$in:collection?.questions},...searchQuery});
    const questions = await Question.find({
      _id: { $in: collection?.questions },
      ...searchQuery
    }).sort(sortCriteria).skip(skip).limit(limit).populate('tags').populate('author');
    const data = {
      _id: userId,
      author: collection.author,
      questions,
    };
    const isNext = skip + limit < totalCount;

    return {
      success: true,
      data: {
        Collection: JSON.parse(JSON.stringify(data)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
