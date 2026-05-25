import { model, Schema, models, Types } from "mongoose";

export interface IQuestion {
  _id: string;
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views?: number;
  upvotes?: number;
  downvotes?: number;
  answers?: number;
  author: Types.ObjectId;
}

export interface IQuestionDoc extends IQuestion, Document {}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 }, // make separate collection for answers
    author: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true },
);

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);
export default Question;
