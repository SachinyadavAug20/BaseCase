"use client";
import { formUrlQuery } from "@/lib/url";
import { Button } from "./ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  page?: number | string | undefined;
  isNext?: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses = "" }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: "prev" | "next") => {
    const nextpage = type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextpage.toString(),
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div
      className={`flex w-full items-center justify-center mt-5 gap-2 ${containerClasses}`}
    >
      <Button
        disabled={!(Number(page) > 1)}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn min-h-9 flex items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800 ">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn min-h-9 flex items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800 ">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
