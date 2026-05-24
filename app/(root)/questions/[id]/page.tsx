import TagCard from "@/components/card/TagCard";
import Preview from "@/components/editor/preview";
import Metric from "@/components/ui/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constant/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getsTimeStamp } from "@/lib/utils";
import { RouteParamas } from "@/types/global";
import { redirect } from "next/navigation";
import Link from "next/link";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { GetAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { Suspense } from "react";
import SaveQuestion from "@/components/questions/SaveQuestion";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: RouteParamas): Promise<Metadata> {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });
  if (!success || !question) {
    return {
      title: "Question not found",
      description: "This question is not available on our platform",
    };
  }
  const cleanDescription = question.content
    .replace(/[#*`_\[\]]/g, "") // Simple regex to strip basic markdown if needed
    .replace(/<[^>]*>/g, "") // Strips HTML tags if it's rich text
    .trim();

  const title = `${question.title} | BaseCase`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    title,
    description: cleanDescription.slice(0, 150),
    openGraph: {
      title,
      description:cleanDescription.slice(0,150),
      url: `${siteUrl}/${ROUTES.QUESTIONS}/${id}`,
      type: "article",
      siteName: "BaseCase",
      images: [
        {
          url: "/images/site-logo.svg",
          width: 1200,         
          height: 630,        
          alt: question.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription.slice(0, 100),
      images:[{url:"/images/site-logo.svg"}]
    },
  };
}

const page = async ({ params, searchParams }: RouteParamas) => {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });

  after(async () => {
    await incrementViews({ questionId: id }); // it is called after render not blocking
  });

  if (!success || !question) {
    return redirect("/404");
  }
  const { pageSize, filter, page } = await searchParams;
  const {
    success: areAnswerloaded,
    data: answerResult,
    error: answerError,
  } = await GetAnswers({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 3,
    filter,
    questionId: id,
  });
  const {
    author,
    createdAt,
    content,
    views,
    upvotes,
    downvotes,
    answers,
    tags,
    title,
  } = question!;
  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });
  const hasSavedPromise = hasSavedQuestion({ questionId: question._id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author?.image}
              className="size-[36px]"
              fallbackclassName={"text-[18px]"}
            />
            <Link href={`${ROUTES.PROFILE}/${author._id}`}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-2">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                targetId={question._id}
                upvotes={upvotes}
                downvotes={downvotes}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedPromise={hasSavedPromise}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={getsTimeStamp(new Date(createdAt))}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answerResult?.answers}
          success={areAnswerloaded}
          error={answerError}
          totalAnswers={answerResult?.totalAnswers || 0}
          page={Number(page) || 1}
          pageSize={Number(pageSize) || 3}
          isNext={answerResult?.isNext}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default page;
