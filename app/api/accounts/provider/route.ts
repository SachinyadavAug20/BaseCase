import dbConnect from "@/lib/mongoose";
import Account from "@/dataBase/account.model";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { APIErrorResponse } from "@/types/global";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";

export async function POST(req: Request) {
  try {
    const {providerAccountId} = await req.json();
    await dbConnect()
    const validatedData = AccountSchema.partial().safeParse({providerAccountId})
    if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)
    const account = await Account.findOne({providerAccountId:providerAccountId});
    if(!account) throw new NotFoundError("Account")
    return NextResponse.json(
      { success: true, data: account},
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse
  }
}
