import { NextResponse } from "next/server";

interface Tags {
  _id: string;
  name: string;
}
interface Author {
  _id: string;
  name: string;
  image?: string;
}
interface IQuestion {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  author: Author;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}
type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParamas{
  params: Promise<Record<string,string>>;
  searchParams: Promise<Record<string,string>>
}

export interface PaginatedSearchParams{
  page?:number,
  pageSize?:number;
  query?:string;
  filter?:string;
  sort?:string;
}

// Record<string,string> means key value pair of string:string
