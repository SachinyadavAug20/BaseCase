import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/card/QuestionCard";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { query, filter } = await searchParams;
  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchesQuery && matchesFilter;
  });

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
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((q) => (
          <div key={q._id}>
            <QuestionCard question={q} />
          </div>
        ))}
      </div>
    </>
  );
}
