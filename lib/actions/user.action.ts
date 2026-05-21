"use server";

import {
  ActionResponse,
  ErrorResponse,
  IQuestion,
  PaginatedSearchParams,
} from "@/types/global";
import { IUser } from "@/types/global";
import action from "../handlers/action";
import {
  GetUserQuestionsSchema,
  GetUserSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { Answers, Question, User } from "@/dataBase";
import { GetUserParams, GetUserQuestionsParams } from "@/types/action";
import { inspect } from "util";
import { useId } from "react";
import { NotFoundError } from "../http-error";

export async function getUsers(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: IUser[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof User> = {};
  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }
  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = users.length + skip < totalUsers;
    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionResponse<{
    user: IUser;
    totalQuestions: number;
    totalAnswers: number;
  }>
> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId } = validatedResult.params!;

  try {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User");
    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answers.countDocuments({ author: userId });
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalAnswers,
        totalQuestions,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: IQuestion[];
    isNext: boolean;
  }>
> {
  const validatedResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize = 10 } = validatedResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit)
      .sort({createdAt:-1});
    const isNext = questions.length + skip < totalQuestions;
    return {
      success: true,
      data: {
        questions:JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
