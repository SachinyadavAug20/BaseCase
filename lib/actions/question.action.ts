"use server";

import { createQuestionParams, editQuestionParams, getQuestionParams } from "@/types/action";
import { ActionResponse, ErrorResponse, IQuestion } from "@/types/global";
import action from "../handlers/action";
import { AskQuestionSchema, EditQuestionSchema, getQuestionSchema } from "../validation";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import handleError from "../handlers/error";
import mongoose, { Mongoose } from "mongoose";
import Question from "@/dataBase/question.model";
import { throws } from "assert";
import Tag, { ITag, ITagDoc } from "@/dataBase/tag.model";
import TagQuestion from "@/dataBase/tag-question.model";
import { NotFoundError } from "../http-error";

export async function createQuestion(
  params: createQuestionParams,
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult",validationResult);
  const userId=validationResult?.session?.user?.id;
  const { title, content, tags } = validationResult.params!;
  // as need to update tag count and ref so need to start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newQuestion] = await Question.create([{ title, content,author:userId }], { session });
    if(!newQuestion) throw new Error("Failed to create question");
    const tagIds:mongoose.Types.ObjectId[]=[];
    const tagQuestionDocuments=[];
    for(const tag of tags){
      const existingTag=await Tag.findOneAndUpdate(
        {name:{$regex:new RegExp(`^${tag}$`,"i")}}, // serarch by name case insensitive
        {$setOnInsert:{name:tag},$inc:{questions:1}},// if not found create and if fount increment question by 1
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

export async function editQuestion( params: editQuestionParams,): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema:EditQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult",validationResult);
  const { title, content, tags,questionId } = validationResult.params!;
  const userId=validationResult?.session?.user?.id;
  // as need to update tag count and ref so need to start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question=await Question.findById(questionId).populate("tags"); // no mutation action so no sersion added
    if(!question) throw new NotFoundError("Question");
    if(question.author.toString()!==userId) throw new Error("You are not allowed to edit this question");
    if(question.title!==title) question.title=title;
    if(question.content!==content) question.content=content;
    await question.save({session});
    const tagstoAdd=tags.filter((tag)=>!question.tags.includes(tag.toLowerCase()))
    const tagstoRemove=question.tags.filter((tag:ITagDoc)=>!tags.includes(tag.name.toLowerCase()))

    const newTagDocument=[];
    if(tagstoAdd.length>0){
      for(const tag of tagstoAdd){
        const existingTag=await Tag.findOneAndUpdate(
          {name:{$regex:new RegExp(`^${tag}$`,"i")}},
          {$setOnInsert:{name:tag},$inc:{questions:1}},
          {upsert:true,new:true,session});
          if(existingTag){newTagDocument.push({tag:existingTag._id,question:questionId});
            question.tags.push(existingTag);
          }
      }
    }
    if(tagstoRemove.length>0){
      const tagIdsToRemove=tagstoRemove.map((tag:ITagDoc)=>tag._id);
      await Tag.updateMany(
        {_id:{$in:tagIdsToRemove}},
        {$inc:{questions:-1}},
        {session}
      )
      await TagQuestion.deleteMany(
        {tag:{$in:tagIdsToRemove},question:questionId},{session}
      )
      question.tags=question.tags.filter((tagId:mongoose.Types.ObjectId)=>!tagstoRemove.includes(tagId))
    }
    if(newTagDocument.length>0){
      await TagQuestion.insertMany(newTagDocument,{session})
    }
    await question.save({session});
    await session.commitTransaction();
    return {success:true,data:JSON.parse(JSON.stringify(question))}
  }catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally{
    session.endSession();
  }
}

export async function getQuestion( params: getQuestionParams,): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema:getQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  console.log("validationResult",validationResult);
  const { questionId } = validationResult.params!;
  const userId=validationResult?.session?.user?.id;
  try {
    const question=await Question.findById(questionId).populate("tags");
    if(!question) throw new NotFoundError("Question")
      return {success:true,data:JSON.parse(JSON.stringify(question))}
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
