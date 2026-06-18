import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constant/states";
import QuestionCard from "@/components/card/QuestionCard";
import CommonFilter from "@/components/filters/CommonFilter";
import { HomePageFilters } from "@/constant/filter";
import Pagination from "@/components/Pagination";
import DRquestions from "@/components/datarenderes/DRquestions";
import AnimatedList from "@/components/AnimatedList";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams; // are from url so strings
  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { questions } = data || {};

  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-11.5 px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASKQUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route="/"
          iconsPosition="left"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] "
          containerClasses="max-md:flex max-md:flex"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        <DataRenderer
          sucess={success}
          error={error}
          data={questions}
          empty={EMPTY_QUESTIONS}
          render={(questions) => (
            <AnimatedList x={100} y={200}>
              {questions.map((q) => (
                <DRquestions q={q} key={q._id} />
              ))}
            </AnimatedList>
          )}
        />
      </div>
      <Pagination page={page} isNext={data?.isNext || false} />
    </>
  );
}
