import Tag, { ITag } from "@/dataBase/tag.model";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";

export const getTags = async (
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: ITag[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { page = 1, pageSize = 10, query, filter, sort } = params;
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
    const totaltags=await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);
    const isNext = totaltags > skip + tags.length;
    return {success:true,data:{tags:JSON.parse(JSON.stringify(tags)),isNext}}

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
