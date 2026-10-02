"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeUrlQuery } from "@/lib/url";

const filter = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommeded", value: "recommeded" },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter") || "";
  const [active, setActive] = useState(paramFilter);

  useEffect(() => {
    setActive(paramFilter);
  }, [paramFilter]);

  const handleFilterChange = (value: string) => {
    if (value === active) {
      setActive("");
      const newUrl = removeUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-10 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
      {filter.map((f) => {
        return (
          <Button
            onClick={() => {
              handleFilterChange(f.value);
            }}
            className={cn(
              `body-medium shrink-0 rounded-full px-4 py-2 capitalize shadow-none sm:rounded-lg sm:px-6 sm:py-3`,
              active === f.value
                ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                : "bg-light-800 text-light-500 hover:bg-light-400 hover:text-light-800 dark:bg-dark-300 dark:text-ligh-500 dark:hover:bg-dark-400",
            )}
            key={f.name}
          >
            {f.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilter;
