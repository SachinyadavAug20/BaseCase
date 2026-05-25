import Account from "@/dataBase/account.model";
import handleError from "@/lib/handlers/error";
import {
  ForbiddenError,
  NotFoundError,
} from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();
    if (!accounts) throw new NotFoundError("Accounts");
    return NextResponse.json({ sucess: true, data: accounts }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// put account
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = AccountSchema.parse(body);
    await dbConnect();
    const existingUser = await Account.findOne({
      providerAccountId: validatedData.providerAccountId,
      provider: validatedData.provider,
    });
    if (existingUser)
      throw new ForbiddenError(
        "An account with the same provider already exist",
      );
    const newAccount = await Account.create(validatedData);
    return NextResponse.json(
      { sucess: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
