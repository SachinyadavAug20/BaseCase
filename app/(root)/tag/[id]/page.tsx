import QuestionCard from "@/components/card/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constant/states";
import { getDevIcon } from "@/constant/techmap";
import { getTagQuestion } from "@/lib/actions/tag.action"
import { RouteParamas } from "@/types/global"

const page =async ({params}:RouteParamas) => {
  const {id,page,pageSize,query}=await params
  const {success,data,error}=await getTagQuestion({tagId:id,page,pageSize,query});
  const {tag,questions,isNext}=data||{}
  return (
    <div>
      <h2 className="h2-bold text-dark100_light900 w-full flex gap-13 items-center ml-2 justify-between"><span className="text-dark400_light600">{tag.name.toUpperCase()}</span>
          <i className={`${getDevIcon(tag.name)} text-2xl`} aria-hidden="true" />
          </h2>
          
      <div className="mt-10 flex w-full flex-col gap-6">
        <DataRenderer
          sucess={success}
          error={error}
          data={questions}
          empty={EMPTY_QUESTIONS}
          render={(questions) =>
            questions.map((q) => (
              <div key={q._id}>
                <QuestionCard question={q} />
              </div>
            ))
          }
        />
      </div>
    </div>
  )
}

export default page
