import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { SigInWithOAuthSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import User from "@/dataBase/user.model";
import mongoose from "mongoose";
import slugify from "slugify";
import Account from "@/dataBase/account.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  await dbConnect();
  const session = await mongoose.startSession(); // module to do multiple operations => with consitencey do ALL or NONE opeations => atomic function
  // if we try to create an account -> fails
  // try ti create a user -> (must fail as above failed)           to avoid race condition
  session.startTransaction();
  try {
    const validatedData = SigInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    const { name, username, email, image } = validatedData.data.user; // parse username
    const slugifyusername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
    let existingUser = await User.findOne({ email }).session(session); // fail this if any error : part of transaction
    if (!existingUser) {
      [existingUser] = await User.create(
        { name, username: slugifyusername, email, image },
        { session },
      ); // part of transaction
    } else {
      const updatedUser: { name?: string; image?: string } = {}; // will only update name and image
      if (existingUser.name !== name) updatedUser.name = name;
      if (existingUser.image !== image) updatedUser.image = image;
      if (Object.keys(updatedUser).length > 0) {
        // if changes
        await User.findOneAndUpdate(
          { _id: existingUser._id },
          { $set: updatedUser },
        ).session(session);
      }
    }
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);
    if (!existingAccount) {
      await Account.create(
        { userId: existingUser._id, name, image, provider, providerAccountId },
        { session },
      );
    }
    await session.commitTransaction(); // apply all changes to DB atomically
    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction(); // rollback all operations
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    await session.endSession(); // error or success end the session
  }
}
