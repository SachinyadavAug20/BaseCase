import User from "@/dataBase/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// get all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json({ sucess: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create user
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    // need to validate data
    const validatedData = await UserSchema.safeParse(body); // Zod
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors); // correct error to frontend
    }
    const { email, username } = validatedData.data;
    const existingemail = await User.findOne({ email });
    const existingusername = await User.findOne({ username });
    if (existingemail || existingusername) {
      throw new Error("User already exist");
    }

    const newUser = await User.create(validatedData.data);
    return NextResponse.json({ sucess: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
