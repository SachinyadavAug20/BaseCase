import { model,Schema,models, Types } from "mongoose";


export interface IInteraction {
  user:Types.ObjectId
  action:string
  actionId:Types.ObjectId
  actionType:"question"|"answer"|"user"
}

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;
export interface IInteractionDoc extends IInteraction, Document {}


const InteractionSchema = new Schema<IInteraction>({
  user:{type:Schema.Types.ObjectId,ref:"User",require:true},
  action:{type:String,enum:InteractionActionEnums,require:true},
  actionId:{type:Schema.Types.ObjectId,require:true}, // question or answer or user id 
  actionType:{type:String,require:true,enum:["question","answer","user"]},
},{timestamps:true});

const Interaction =models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction

