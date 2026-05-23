"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const [active, setActive] = useState("");
  const filterParams = searchParams.get("filter") ? searchParams.get("filter") : "";

  const handleFilterChange = (value: string) => {
    let newUrl="";
    if (value === active) {
      setActive("");
      newUrl=removeUrlQuery({params:searchParams.toString(),keysToRemove:["filter"]})
      router.push(newUrl,{scroll:false});
    } else {
      setActive(value);
      newUrl=formUrlQuery({params:searchParams.toString(),key:"filter",value:value})
      router.push(newUrl,{scroll:false})
    }
    router.push(newUrl,{scroll:false})
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filter.map((f) => {
        return (
          <Button
            onClick={() => {
              handleFilterChange(f.value);
            }}
            className={cn(
              `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
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
