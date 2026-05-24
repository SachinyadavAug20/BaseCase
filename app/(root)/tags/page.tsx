import TagCard from "@/components/card/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constant/filter";
import ROUTES from "@/constant/routes";
import { EMPTY_TAGS } from "@/constant/states";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParamas } from "@/types/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | BaseCase",
  description:"BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};
const page = async ({ searchParams }: RouteParamas) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 9,
    query,
    filter,
  });
  const { tags } = data || {};
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search by tag name..."
          iconsPosition="left"
          otherClasses="flex-1"
        />
        <CommonFilter filters={TagFilters} otherClasses="sm:min-w-[170px] min-h-[56px]" />
      </section>
      <DataRenderer
        sucess={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag)=>{
              return(
                <TagCard key={tag?._id} {...tag}/>
              )
            })}
          </div>
        )}
      />
      <Pagination page={page} isNext={data?.isNext || false}/>

    </>
  );
};

export default page;
