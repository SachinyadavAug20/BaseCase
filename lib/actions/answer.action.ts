"use server";

import { CreateAnswerParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import Answers, { IAnswerDoc } from "@/dataBase/answer.model";
import {  AnswerServerSchema } from "../validation";
import action from "../handlers/action";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/dataBase";
import { NotFoundError } from "../http-error";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constant/routes";

export async function createAnswer(params:CreateAnswerParams):Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params:params,
    schema:AnswerServerSchema,
    authorize:true,
  })
  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }
  const {content,questionId}=validationResult.params!;
  const userId=validationResult.session?.user?.id;
  const session=await mongoose.startSession();
  session.startTransaction();

  try{
    const question=await Question.findById(questionId);
    if(!question) throw new NotFoundError("Question");
    const [newAnswer]=await Answers.create([{author:userId,content,question:questionId}],{session});
    if(!newAnswer) throw new Error("Failed to create answer");
    question.answers+=1;
    await question.save({session});
    await session.commitTransaction();
    revalidatePath(`${ROUTES.QUESTIONS}/${questionId}`)
    return {success:true,data:JSON.parse(JSON.stringify(newAnswer))}
  }catch(error){
    await session.abortTransaction()
    return handleError(error) as ErrorResponse;
  }finally{
    await session.endSession();
  }
  
}
