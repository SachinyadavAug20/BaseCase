import { model, Schema, models } from "mongoose";

export interface ITag {
  _id: string;
  name: string;
  questions: number;
  createdAt?: Date;
}

export interface ITagDoc extends ITag, Document {}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, require: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);
export default Tag;
