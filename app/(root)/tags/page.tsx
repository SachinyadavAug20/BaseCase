import TagCard from "@/components/card/TagCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constant/routes";
import { EMPTY_TAGS } from "@/constant/states";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParamas } from "@/types/global";

const page = async ({ searchParams }: RouteParamas) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
    query,
    filter,
  });
  const { tags } = data || {};
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search by tag name..."
          iconsPosition="left"
          otherClasses="flex-1"
        />
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
                <TagCard key={tag._id} {...tag}/>
              )
            })}
          </div>
        )}
      />
    </>
  );
};

export default page;
