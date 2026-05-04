"use server";
import { authcredentials } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { SignInSchema, SignUpSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import User from "@/dataBase/user.model";
import bcrypt from "bcryptjs";
import Account from "@/dataBase/account.model";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-error";

export async function signUpWithCredentials(
  params: authcredentials,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name, username, email, password } = validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exist");
    }
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await User.create([{ name, username, email }], {
      session,
    });
    console.log(newUser);
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<authcredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { email, password } = validationResult.params!;
  // no need to start transaction as there is no db operations(changes)
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account");
    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );
    if (!passwordMatch) throw new Error("Password not match");
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
