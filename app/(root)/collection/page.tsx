import { auth } from "@/auth";
import QuestionCard from "@/components/card/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constant/filter";
import ROUTES from "@/constant/routes";
import { EMPTY_COLLECTIONS } from "@/constant/states";
import { getSavedQuestions } from "@/lib/actions/collection.action"
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const page = async ( { searchParams }: SearchParams) => {
  const session=await auth();
  const { page, pageSize, query, filter } = await searchParams;
  const {success,data,error}=await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const {_id,questions}=data?.Collection!;
  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route={ROUTES.COLLECTION}
          iconsPosition="left"
        />
        <CommonFilter filters={CollectionFilters} otherClasses="min-h-[56px] sm:min-w-[170px] "/>
      </section>
      {/*<HomeFilter />*/}
      <div className="mt-10 flex w-full flex-col gap-6">
        <DataRenderer
          sucess={success}
          error={error}
          data={questions}
          empty={EMPTY_COLLECTIONS}
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
    </>
  )
}

export default page
