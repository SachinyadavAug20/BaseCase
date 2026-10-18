"use server";

import { Answers, Question, Tag, User } from "@/dataBase";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { GlobalSearchParams } from "@/types/action";
import { GlobalSearchSchema } from "../validation";
import { ErrorResponse } from "@/types/global";
import { semanticAnswerSearch, semanticQuestionSearch } from "@/lib/embedding/vector-search";

interface GlobalResultItem {
  title: string;
  type: string;
  id: string;
}

export async function globalSearch(params: GlobalSearchParams) {
  try {
    const validationResult = await action({
      params,
      schema: GlobalSearchSchema,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { query, type } = params;
    const queryLower = query.toLowerCase();
    const typeLower = type?.toLowerCase();
    const SearchableTypes = ["question", "answer", "user", "tag"];

    const questionSearch = async (limit: number): Promise<GlobalResultItem[]> => {
      const semantic = await semanticQuestionSearch({ query, limit, skip: 0 });
      if (semantic?.questions) {
        return semantic.questions.map(
          (item: { _id: string; title: string }) => ({
            title: item.title,
            type: "question",
            id: item._id,
          }),
        );
      }
      // fallback: exact regex match
      const queryResults = await Question.find({
        title: { $regex: query, $options: "i" },
      }).limit(limit);
      return queryResults.map(
        (item: { _id: any; title: any }) => ({
          title: item.title,
          type: "question",
          id: item._id as string,
        }),
      );
    };

    const answerSearch = async (limit: number): Promise<GlobalResultItem[]> => {
      const semantic = await semanticAnswerSearch(query, limit);
      if (semantic) {
        return semantic
          .filter((item) => item.content?.toLowerCase().includes(queryLower) || Number(item.score) > 0.5)
          .map((item) => ({
            title:
              item.content.length > 90
                ? `${item.content.slice(0, 90)}...`
                : item.content,
            type: "answer",
            id: item.question,
          }));
      }
      const queryResults = await Answers.find({
        content: { $regex: query, $options: "i" },
      }).limit(limit);
      return queryResults.map(
        (item: { question: any }) => ({
          title: `Answers containing ${query}`,
          type: "answer",
          id: item.question as string,
        }),
      );
    };

    const userSearch = async (limit: number): Promise<GlobalResultItem[]> => {
      const queryResults = await User.find({
        name: { $regex: query, $options: "i" },
      }).limit(limit);
      return queryResults.map(
        (item: { _id: any; name: any }) => ({
          title: item.name,
          type: "user",
          id: item._id as string,
        }),
      );
    };

    const tagSearch = async (limit: number): Promise<GlobalResultItem[]> => {
      const queryResults = await Tag.find({
        name: { $regex: query, $options: "i" },
      }).limit(limit);
      return queryResults.map(
        (item: { _id: any; name: any }) => ({
          title: item.name,
          type: "tag",
          id: item._id as string,
        }),
      );
    };

    let results: GlobalResultItem[] = [];

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search all types: semantic for questions/answers, regex for users/tags
      const [questions, answers, users, tags] = await Promise.all([
        questionSearch(2),
        answerSearch(2),
        userSearch(2),
        tagSearch(2),
      ]);
      results = [...questions, ...answers, ...users, ...tags];
    } else {
      const searchers = {
        question: questionSearch,
        answer: answerSearch,
        user: userSearch,
        tag: tagSearch,
      } as const;

      if (!SearchableTypes.includes(typeLower))
        throw new Error("Invalid search type");
      results = await searchers[typeLower as keyof typeof searchers](8);
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
