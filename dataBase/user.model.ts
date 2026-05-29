import { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { models } from "mongoose"; // gives all instance of model already created

export interface IUser {
  _id?:string,
  name: string;
  username: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  resumelink?: string;
  reputation?: number;
}

export interface IUserDoc extends IUser, Document {};

const UserSchema = new Schema(
  {
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    bio: { type: String },
    image: { type: String, require: true },
    location: { type: String },
    portfolio: { type: String },
    resumelink: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }, // know when user was created
);

const User = models?.User || model<IUser>("User", UserSchema) ; // optimized if model already exist use it
export default User;

