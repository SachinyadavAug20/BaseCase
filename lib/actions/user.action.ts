"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import { IUser } from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { User } from "@/dataBase";

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
    const isNext = users.length+skip < totalUsers;
    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
