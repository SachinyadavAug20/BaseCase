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
