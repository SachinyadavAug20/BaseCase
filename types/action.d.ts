import { PaginatedSearchParams } from "types/global";

export interface SignInWithOAuthParams {
  provider: "github" | "google" | "apple";
  providerAccountId: string;
  user: { name: string; username: string; email: string; image: string };
}
export interface authcredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
export interface createQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

export interface editQuestionParams extends createQuestionParams {
  questionId: string;
}
export interface getQuestionParams {
  questionId: string;
}
export interface GetTagQuestionParams
  extends Omit<PaginatedSearchParams, "query"> {
  tagId: string;
}

export interface IncrementViewsParams {
  questionId: string;
}

export interface CreateAnswerParams {
  questionId: string;
  content: string;
}

export interface GetAnswersParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
  questionId: string;
}

interface CreateVoteParams {
  targetId: string; // can be questionId or answerId
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

export type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}
interface GetUserParams {
  userId: string;
}
interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}
interface GetUserAnswersParams extends Omit<PaginatedSearchParams, "query"> {
  userId: string;
}
interface GetUserTagsParams{
  userId:string
}
interface DeleteItemsParams {
  type: "question" | "answer";
  itemId: string;
}
interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer";
}
interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams{
  userId:string,
  query?:string,
  skip:number,
  limit:number,
}

interface JobFilterParams{
  query:string,
  page:string // as will pass to url
}

interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

interface Country {
  name: {
    common: string;
  };
}

interface GlobalSearchParams{
  query:string,
  type:string|null;
}

interface UpdateUserParams{
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  password?: string;
}
