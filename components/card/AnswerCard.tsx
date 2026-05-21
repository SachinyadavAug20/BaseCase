import { IAnswer } from "@/types/global";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constant/routes";
import { getsTimeStamp } from "@/lib/utils";
import Preview from "../editor/preview";
import { Suspense } from "react";
import Votes from "../votes/votes";
import { hasVoted } from "@/lib/actions/vote.action";

interface Props extends IAnswer{
  containerClasses?:string,
  showReadMore?:boolean
}

const AnswerCard = ({ _id, author, content, createdAt,upvotes,downvotes,question,containerClasses, showReadMore=false }: Props) => {

  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article className={`light-border border-b py-10 w-full ${containerClasses}`}>
      <span id={`answer-${_id}`} className="hash-span" />
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-center gap-1">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author?.image}
            className="size-5 rounded-full object-cover max-sm:mt-0.5"
          />
          <Link
            href={`${ROUTES.PROFILE}/${author._id}`}
            className="flex flex-col sm:flex-row sm:items-center max-sm:ml-1"
          >
            <p className="body-semibold text-dark300_light700">
              {author?.name ? author.name : "Anonymous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getsTimeStamp(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType='answer'
                targetId={_id}
                upvotes={upvotes}
                downvotes={downvotes}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
        </div>
      </div>
      <Preview content={content} />
      {showReadMore && (
        <Link href={`${ROUTES.QUESTIONS}/${question}#answer-${_id}`} className="body-semibold relative z-10 font-logofont text-primary-500"><p className="mt-1">Read more...</p></Link>
      )}
    </article>
  );
};

export default AnswerCard;
