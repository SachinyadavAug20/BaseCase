"use server";

import { CreateAnswerParams, GetAnswersParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import Answers, { IAnswerDoc } from "@/dataBase/answer.model";
import { AnswerServerSchema, GetAnswerSchema } from "../validation";
import action from "../handlers/action";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/dataBase";
import { NotFoundError } from "../http-error";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constant/routes";
import { createInteraction } from "./interaction.action";
import { after } from "next/server";


export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params: params,
    schema: AnswerServerSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { content, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");
    const [newAnswer] = await Answers.create(
      [{ author: userId, content, question: questionId }],
      { session },
    );
    if (!newAnswer) throw new Error("Failed to create answer");
    question.answers += 1;
    await question.save({ session });
    after(async ()=>{ // response send and then create interaction
      await createInteraction({
        action: "post",
        actionId: newAnswer._id.toString(),
        actionTarget: "answer",
        authorId: userId as string,
    })})
    await session.commitTransaction();
    revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`);
    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function GetAnswers(
  params: GetAnswersParams,
): Promise<ActionResponse<{ answers: IAnswerDoc[];isNext:boolean; totalAnswers: number }>> {
  const validationResult = await action({
    params,
    schema: GetAnswerSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page=1,filter, pageSize=10, questionId } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  let sortCriteria = {};
  switch (filter) {
    case "latest":
      sortCriteria={createdAt:-1}
      break;
    case "oldest":
      sortCriteria={createdAt:1}
      break;
    case "popular":
      sortCriteria={upvotes:-1}
      break;
    default:
      sortCriteria={createdAt:-1}
      break;
  }
  try{
    const totalAnswers = await Answers.countDocuments({question:questionId});
    const answers = await Answers.find({question:questionId}).populate("author","_id name image").sort(sortCriteria).skip(skip).limit(limit);
    const isNext = skip + answers.length < totalAnswers;
    return {
      success: true,
      data:{
        answers:JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers
      }
    }
  }catch(error){
    return handleError(error) as ErrorResponse
  }
}
