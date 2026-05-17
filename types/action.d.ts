import {PaginatedSearchParams} from 'types/global'

export interface SignInWithOAuthParams{
  provider:'github'|'google'|'apple',
  providerAccountId:string,
  user:{name:string;username:string;email:string;image:string}
}
export interface authcredentials{
  name:string,
  username:string,
  email:string,
  password:string,
}
export interface createQuestionParams{
  title:string,
  content:string,
  tags:string[]
}

export interface editQuestionParams extends createQuestionParams{
  questionId:string,
}
export interface getQuestionParams{
  questionId:string,
}
export interface GetTagQuestionParams extends Omit<PaginatedSearchParams,'filter'>{
  tagId:string;
}

export interface IncrementViewsParams{
  questionId:string;
}

export interface CreateAnswerParams{
  questionId:string,
  content:string
}

export interface GetAnswersParams{
  page?:number,
  pageSize?:number;
  query?:string;
  filter?:string;
  sort?:string;
  questionId:string
}

interface CreateVoteParams{
  targetId:string, // can be questionId or answerId
  targetType:'question'|'answer',
  voteType:'upvote'|'downvote',
}

export interface UpdateVoteCountParams extends CreateVoteParams{
  change: 1 | -1,
}

export type HasVotedParams = Pick<CreateVoteParams,'targetId'|'targetType'>;

interface HasVotedResponse{
  hasUpvoted:boolean,
  hasDownvoted:boolean
}

interface CollectionBaseParams{
  questionId:string
}
