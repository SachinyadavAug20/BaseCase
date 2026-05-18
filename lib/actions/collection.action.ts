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
import { Mongoose, Types } from "mongoose";

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
      if(hasQuestion){
        collection.questions = collection.questions.filter((id:Types.ObjectId) => id.toString() !== questionId);
        await collection.save();
        revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`);
        return { success: true, data: { saved: false } };
      }else{
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
    if(collection){
      const hasQuestion = collection.questions.includes(questionId);
      return { success: true, data: { saved: !!hasQuestion } }; // !! used to convert to boolean
    }else{
      return { success: true, data: { saved: false } }; // !! used to convert to boolean
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
