"use server";

import { createQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { AskQuestionSchema } from "../validation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/dataBase/question.model";
import { throws } from "assert";
import Tag, { ITag } from "@/dataBase/tag.model";
import TagQuestion from "@/dataBase/tag-question.model";

export async function createQuestion(
  params: createQuestionParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const userId=validationResult?.session?.user;
  const { title, content, tags } = validationResult.params!;
  // as need to update tag count and ref so need to start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newQuestion] = await Question.create([{ title, content, tags,author:userId }], { session });
    if(!newQuestion) throw new Error("Failed to create question");
    const tagIds:mongoose.Types.ObjectId[]=[];
    const tagQuestionDocuments=[];
    for(const tag of tags){
      const existingTag=await Tag.findOneAndUpdate(
        {name:{$regex:new RegExp(`^${tag}$`,"i")}}, // serarch by name case insensitive
        {$setOnInsert:{name:tag},$inc:{question:1}},// if not found create and if fount increment question by 1
        {upsert:true,new:true,session});// optional params
        tagIds.push(existingTag._id);
        tagQuestionDocuments.push({
          tag:existingTag._id,
          question:newQuestion._id
        })
    }
    // push to DB
    await TagQuestion.insertMany(tagQuestionDocuments,{session});
    await Question.findOneAndUpdate(
      newQuestion._id,
      {$push:{tags:{$each:tagIds}}},
      {session}
    )
    await session.commitTransaction();
    return {success:true,data:JSON.parse(JSON.stringify(newQuestion))}

  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
