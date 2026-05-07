import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/card/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import { error } from "console";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const {page,pageSize,query,filter}=await searchParams // are from url so strings
  const {success,data}=await getQuestions({page:Number(page)||1,pageSize:Number(pageSize)||10,query:query||"",filter:filter||""});
  const {questions}=data||{}
  

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
      <section className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route="/"
          iconsPosition="left"
        />
      </section>
      <HomeFilter />
      {success?(

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions && questions.length>0 ?questions.map((q) => (
          <div key={q._id}>
            <QuestionCard question={q} />
          </div>
        )) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700 ">No Question found</p>
        </div>
        )}
      </div>
      ):(
      <div className="m-10 flex w-full items-center justify-center">
        <p className="text-dark400_light700">
          { "Failed to get questions" }
        </p>
      </div>
      )}
</>
  );
}
