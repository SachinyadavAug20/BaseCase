import ROUTES from "@/constant/routes";
import Link from "next/link";
import Image from "next/image";
import TagCard from "../card/TagCard";
import { getHotQuestion } from "@/lib/actions/question.action";
import DataRenderer from "../DataRenderer";
import { getPopularTags } from "@/lib/actions/tag.action";
import { promise } from "zod/v4";
import AnimatedList from "../AnimatedList";

const RightSideBar = async () => {
  const [
    { success, data: hotQuestion, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestion(), getPopularTags()]);
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-lg:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <DataRenderer
          data={hotQuestion}
          error={error}
          sucess={success}
          empty={{
            title: "No hot questions yet",
            message:
              "No one has asked anything yet. Don't be shy—there are no stupid questions here!",
          }}
          render={(hotQuestion) => (
            <AnimatedList>
              {hotQuestion?.map((e) => (
                <div key={e._id} className="mt-7 w-full flex flex-col gap-30">
                  <Link
                    className="flex cursor-pointer items-center justify-between gap-7"
                    href={`${ROUTES.QUESTIONS}/${e._id}`}
                  >
                    <p className="body-medium text-dark500_light700 line-clamp-2">
                      {e.title}
                    </p>
                    <Image
                      src="/icons/chevron-right.svg"
                      width={20}
                      height={20}
                      alt="chevron-right"
                      className="invert-colors"
                    />
                  </Link>
                </div>
              ))}
            </AnimatedList>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          sucess={tagSuccess}
          error={tagError}
          data={tags}
          empty={{
            title: "No popular tags yet",
            message:
              "No one has asked anything yet. Don't be shy—there are no stupid questions here!",
          }}
          render={(popularTags) => (
            <div className="mt-7 flex w-full flex-col gap-4">
              <AnimatedList>
                {popularTags.map((e) => {
                  return (
                    <div className="px-1 py-2" key={e.name}>
                      <TagCard
                        _id={e._id}
                        name={e.name}
                        questions={Number(e.questions)}
                        showCount={true}
                        compact={true}
                      />
                    </div>
                  );
                })}
              </AnimatedList>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSideBar;
