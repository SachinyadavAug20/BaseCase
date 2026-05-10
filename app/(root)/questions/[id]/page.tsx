import TagCard from "@/components/card/TagCard";
import Metric from "@/components/ui/Metric";
import UserAvatar from "@/components/UserAvatar";
import { sampleQuestion } from "@/constant";
import ROUTES from "@/constant/routes";
import { Answers } from "@/dataBase";
import { ITag } from "@/dataBase/tag.model";
import { formatNumber, getsTimeStamp } from "@/lib/utils";
import { RouteParamas } from "@/types/global"
import Link from "next/link";

const page = async ({params}:RouteParamas) => {
  const sameple_question=sampleQuestion
  const {author,content,createdAt,tags,upvotes,views,title,answers}=sameple_question
  const {id}=await params;

  return (
    <>
    <div className="flex-start w-full flex-col">
      <div className="flex w-full flex-col-reverse justify-between">
        <div className="flex items-center justify-start gap-1">
          <UserAvatar id={author._id} name={author.name} className="size-[36px]" fallbackclassName={"text-[18px]"}/>
          <Link href={`${ROUTES.PROFILE}/${author._id}`}>
            <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
          </Link>
        </div>
        <div className="flex justify-end">
          <p>Votes</p>
        </div>
      </div>
      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{title}</h2>
    </div>
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <Metric imgUrl="/icons/clock.svg" alt="clock icon" value={getsTimeStamp(new Date(createdAt))} title="" textStyles="small-regular text-dark400_light700" titleStyles="max-sm:hidden"/>
      <Metric imgUrl="/icons/message.svg" alt="message icon" value={answers} title="" textStyles="small-regular text-dark400_light700" titleStyles="max-sm:hidden"/>
      <Metric imgUrl="/icons/eye.svg" alt="eye icon" value={formatNumber(views)} title="" textStyles="small-regular text-dark400_light700" titleStyles="max-sm:hidden"/>
    </div>
    <p>Preview Content</p>
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag)=>(
        <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact/>
      ))}
    </div>
    </>
  )
}

export default page
