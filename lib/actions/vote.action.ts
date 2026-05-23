"use server";

import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types/action";
import action from "../handlers/action";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validation";
import { ActionResponse, ErrorResponse } from "@/types/global";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-error";
import mongoose, { ClientSession } from "mongoose";
import { Answers, Question, Vote } from "@/dataBase";
import { success } from "zod/v4";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constant/routes";
import { createInteraction } from "./interaction.action";
import { after } from "next/server";


export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType, change } = validationResult.params!;
  const MODEL = targetType === "question" ? Question : Answers;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";
  try {
    // it is very dynamic works for question and answer / upvote or downvote
    const result = await MODEL.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session },
    );
    if (!result) throw new NotFoundError("Update");
    return { success: true, data: result };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new NotFoundError("User")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingVote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    }).session(session);
    if (existingVote) {
      const oppositeVote = voteType === "upvote" ? "downvote" : "upvote";
      if (existingVote.voteType === voteType) {
        // remove vote
        await Vote.deleteOne({ 
          _id: existingVote._id,
          author: userId 
        }).session( session,);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session,
        );
        await updateVoteCount(
          { targetId, targetType, voteType:oppositeVote, change: -1 },
          session,
        );
      }
    } else {
      // not touched
      await Vote.create(
        [
          {
            author: userId,
            id: targetId,
            type: targetType,
            voteType: voteType,
          },
        ],
        { session },
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session,
      );
    }
    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: userId,
      });
    });
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
    revalidatePath(`${ROUTES.QUESTIONS}/${targetId}`);
  }
}

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { targetId, targetType } = validationResult.params!;
  const UserId = validationResult.session?.user?.id;
  try {
    const vote = await Vote.findOne({
      author: UserId,
      id: targetId,
    });
    if (!vote) {
      return {
        success: true,
        data: { hasDownvoted: false, hasUpvoted: false },
      };
    }
    return {
      success: true,
      data: {
        hasDownvoted: vote.voteType === "downvote",
        hasUpvoted: vote.voteType === "upvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
