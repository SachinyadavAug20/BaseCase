import Tag, { ITag, ITagDoc } from "@/dataBase/tag.model";
import {
  ActionResponse,
  ErrorResponse,
  IQuestion,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import {
  GetTagQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { GetTagQuestionParams } from "@/types/action";
import { Question } from "@/dataBase";
import dbConnect from "../mongoose";
import { cache } from "react";

export const getTags = async (
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: ITag[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Tag> = {};
  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }
  let sortCriteria = {};
  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
  }
  try {
    const totaltags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totaltags > skip + tags.length;
    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestion = async (
  params: GetTagQuestionParams,
): Promise<
  ActionResponse<{ tag: ITag; questions: IQuestion[]; isNext: boolean }>
> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { page = 1, pageSize = 10, filter, tagId } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQ: FilterQuery<typeof Question> = {};
  let sortCriteria = {};
  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQ.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }
  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");
    const filterQuery: FilterQuery<typeof Question> = {
      tags: { $in: [tag] },
    };
    if (filter === "unanswered") filterQuery.answers = 0;

    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export async function getPopularTags():Promise<ActionResponse<ITag[]>>{
  try {
    await dbConnect();
    const tags=await Tag.find().sort({questions:-1}).limit(5)
    return{
      success:true,
      data:JSON.parse(JSON.stringify(tags))
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export const getTagById=cache(
 async function getTagById(tagId:string):Promise<ActionResponse<ITag>>{
  try {
    await dbConnect();
    const tag=await Tag.findById(tagId)
    if(!tag) throw new Error("Tag not found")
    return{
      success:true,
      data:JSON.parse(JSON.stringify(tag))
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
)
