import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/card/QuestionCard";

// placeholder data
const questions = [ { _id: "1", title: "How to learn React?", description: "I want to learn React, can anyone help me?", tags: [ { _id: "1", name: "React" }, { _id: "2", name: "JavaScript" }, ], author: { _id: "1", name: "John Doe",image:"/images/avatar.png" }, upvotes: 15, downvotes: 2, answers: 6, views: 120, createdAt: new Date("2026-04-26T10:00:00"), }, { _id: "2", title: "Best way to master JavaScript fundamentals?", description: "Looking for a solid roadmap to learn JS deeply.", tags: [ { _id: "2", name: "JavaScript" }, { _id: "4", name: "Programming" }, ], author: { _id: "2", name: "Alice" ,image:"/images/avatar.png"}, upvotes: 20, downvotes: 3, answers: 8, views: 200, createdAt: new Date("2026-04-25T08:30:00"), }, { _id: "3", title: "How does Next.js routing work?", description: "Confused between app router and pages router.", tags: [ { _id: "3", name: "Next" }, { _id: "1", name: "React" }, ], author: { _id: "3", name: "Bob" ,image:"/images/avatar.png"}, upvotes: 12, downvotes: 1, answers: 4, views: 150, createdAt: new Date("2026-04-20T12:00:00"), }, { _id: "4", title: "Node.js vs Deno: which should I use?", description: "Trying to decide between Node and Deno for backend.", tags: [ { _id: "5", name: "Node" }, { _id: "6", name: "Deno" }, ], author: { _id: "4", name: "Charlie" ,image:"/images/avatar.png"}, upvotes: 18, downvotes: 4, answers: 7, views: 220, createdAt: new Date("2026-03-15T09:00:00"), }, { _id: "5", title: "How to manage state in React apps?", description: "Redux vs Context API vs Zustand?", tags: [ { _id: "7", name: "Redux" }, { _id: "1", name: "React" }, ], author: { _id: "5", name: "David" ,image:"/images/avatar.png"}, upvotes: 25, downvotes: 5, answers: 10, views: 300, createdAt: new Date("2025-12-01T14:00:00"), }, { _id: "6", title: "How to optimize performance in Next.js?", description: "My app feels slow, need optimization tips.", tags: [ { _id: "3", name: "Next" }, { _id: "8", name: "Performance" }, ], author: { _id: "6", name: "Eve" ,image:"/images/avatar.png"}, upvotes: 14, downvotes: 2, answers: 5, views: 180, createdAt: new Date("2024-04-26T10:00:00"), }, { _id: "7", title: "MongoDB vs PostgreSQL: which is better?", description: "Confused about choosing a database for my project.", tags: [ { _id: "9", name: "MongoDB" }, { _id: "10", name: "PostgreSQL" }, ], author: { _id: "7", name: "Frank" ,image:"/images/avatar.png"}, upvotes: 22, downvotes: 3, answers: 9, views: 260, createdAt: new Date("2019-06-10T10:00:00"), }, ];


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
