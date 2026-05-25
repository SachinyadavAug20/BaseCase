import ROUTES from "@/constant/routes";
import { getsTimeStamp } from "@/lib/utils";
import Link from "next/link";
import TagCard from "./TagCard";
import Metric from "../ui/Metric";
import { IQuestion } from "@/types/global";
import EditeDeleteAction from "../user/EditeDeleteAction";

const QuestionCard = ({ question: { _id, title, tags, author, createdAt, upvotes,  answers, views, },showActionBtn=false }: { question:IQuestion,showActionBtn?:boolean }) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden"> 
            {getsTimeStamp(createdAt)}
          </span>
          <Link href={`${ROUTES.QUESTIONS}/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtn &&(
          <EditeDeleteAction type='question' itemId={_id}/>
        )}
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag) => {
          return (
            <TagCard
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
              compact={true}
            />
          );
        })}
      </div>
      <div className="flex-between gap-3 mt-6 w-full flex-wrap">
        <Metric
          imgUrl={author.image || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.icon-icons.com%2F1378%2FPNG%2F512%2Favatardefault_92824.png&f=1&nofb=1&ipt=529ae9117efd92205b685407e6c513cbde90d2b585c3c35c921b44eac5cfa9c1"}
          alt={author.name}
          value={author.name}
          title={` • asked ${getsTimeStamp(createdAt)} Ago`}
          href={`${ROUTES.PROFILE}/${author._id}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
            />
          <Metric
            imgUrl="/icons/message.svg"
            alt="Answers"
            value={answers}
            title="answers"
            textStyles="small-medium text-dark400_light800"
            />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
            />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
