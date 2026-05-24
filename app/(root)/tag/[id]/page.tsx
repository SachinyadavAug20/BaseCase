import QuestionCard from "@/components/card/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import { HomePageFilters, TagFilters } from "@/constant/filter";
import { EMPTY_QUESTIONS } from "@/constant/states";
import { getDevIcon } from "@/constant/techmap";
import { getTagQuestion } from "@/lib/actions/tag.action";
import { RouteParamas } from "@/types/global";

const page = async ({ params,searchParams }: RouteParamas) => {
  const { id } = await params;
  const { page, pageSize, query, filter}=await searchParams;
  const { success, data, error } = await getTagQuestion({
    tagId: id,
    page:Number(page)||1,
    pageSize:Number(pageSize)||10,
    filter,
    query,
  });
  const { tag, questions, isNext } = data || {};
  return (
    <div>
      <h2 className="h2-bold text-dark100_light900 w-full flex gap-13 items-center ml-2 justify-between">
        <span className="text-dark400_light600">{tag?.name.toUpperCase()}{" Questions"}</span>
        <i className={`${getDevIcon(tag?.name)} text-2xl`} aria-hidden="true" />
      </h2>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="sm:min-w-[170px] min-h-[56px]"
        />
      </section>
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
        <Pagination page={page} isNext={data?.isNext || false}/>

    </div>
  );
};

export default page;
