import { model,Schema,models, Types } from "mongoose";

export interface IAnswers {
  author:Types.ObjectId
  question:Types.ObjectId
  content:string
  upvotes:number
  downvotes:number
}

export interface IAnswerDoc extends IAnswers,Document{}

const AnswersSchema = new Schema<IAnswers>({
  author:{type:Schema.Types.ObjectId,ref:"User",require:true},
  question:{type:Schema.Types.ObjectId,ref:"Question",require:true},// answer can be to only one question
  content:{type:String,require:true},
  upvotes:{type:Number,default:0},
  downvotes:{type:Number,default:0},
},{timestamps:true});

const Answers =models?.Answers || model<IAnswers>("Answers", AnswersSchema);
export default Answers
