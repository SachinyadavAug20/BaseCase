import QuestionCard from "@/components/card/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import { HomePageFilters, TagFilters } from "@/constant/filter";
import ROUTES from "@/constant/routes";
import { EMPTY_QUESTIONS } from "@/constant/states";
import { getDevIcon, getTechDescription } from "@/constant/techmap";
import { getTagById, getTagQuestion } from "@/lib/actions/tag.action";
import { RouteParamas } from "@/types/global";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: RouteParamas): Promise<Metadata> {
  const { id } = await params;

  const { success, data, error } = await getTagById(id);
  if (!success || !data) {
    return {
      title: "Tag not found | baseCase",
      description: "This tag is not available on our platform",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: `${data.name} | BaseCase`,
    description: `${data.name} ${getTechDescription(data.name)}.BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.`,
    openGraph: {
      title: `${data.name} | BaseCase`,
      description: `${data.name} ${getTechDescription(data.name)}.BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.`,
      url: `${siteUrl}/${ROUTES.TAG}/${id}`,
      type: "article",
      siteName: "BaseCase",
      images: [
        {
          url: "/images/site-logo.svg",
          width: 1200,
          height: 630,
          alt: data.name,
        },
      ],
    },
    twitter: {
      title: `${data.name} | BaseCase`,
      description: `${data.name} ${getTechDescription(data.name)}.BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.`,
      card: "summary_large_image",
      images: [{ url: "/images/site-logo.svg" }],
    },
  };
}

const page = async ({ params, searchParams }: RouteParamas) => {
  const { id } = await params;
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTagQuestion({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  });
  const { tag, questions, isNext } = data || {};
  return (
    <div>
      <h2 className="h2-bold text-dark100_light900 w-full flex gap-13 items-center ml-2 justify-between">
        <span className="text-dark400_light600">
          {tag?.name.toUpperCase()}
          {" Questions"}
        </span>
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
      <Pagination page={page} isNext={data?.isNext || false} />
    </div>
  );
};

export default page;
