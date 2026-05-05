import User from "@/dataBase/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;
  if (!email) throw new NotFoundError("email");
  try {
    const validatedData = UserSchema.partial().safeParse({email});
    if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)
    await dbConnect();
    const user = await User.findOne({ email:email });
    if(!user) throw new NotFoundError("User");
    return NextResponse.json({success:true,data:user},{status:200})
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
