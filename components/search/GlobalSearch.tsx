"use client";

import { formUrlQuery, removeUrlQuery } from "@/lib/url";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(query || false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("click",handleOutSideClick);
    return ()=>{
      document.removeEventListener("click",handleOutSideClick);
    }
  },[]);

  useEffect(()=>{
    const delayDebounceFn = setTimeout(() => {
      if(search){
        const newURL=formUrlQuery({params:searchParams.toString(),key:"global",value:search});
        router.push(newURL,{scroll:false})
      }else{
        if(query){
          const newURL=removeUrlQuery({params:searchParams.toString(),keysToRemove:["global","type"]});
          router.push(newURL,{scroll:false})
        }
      }
    },300)
    return ()=> clearTimeout(delayDebounceFn);
  },[search,searchParams,router,router,query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search anything globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
