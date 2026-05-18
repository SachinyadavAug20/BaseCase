"use server";

import { CollectionBaseParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { CollectionBasedSchema } from "../validation";
import handleError from "../handlers/error";
import { Collection, Question } from "@/dataBase";
import { NotFoundError } from "../http-error";
import ROUTES from "@/constant/routes";
import { revalidatePath } from "next/cache";

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
      questions: questionId,
    });
    if (collection) {
      // if saved
      await Collection.findByIdAndDelete(collection.id); // delete
      return { success: true, data: { saved: false } };
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

