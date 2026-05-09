
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
