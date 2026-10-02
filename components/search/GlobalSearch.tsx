"use client";
import { formUrlQuery, removeUrlQuery } from "@/lib/url";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import GlobalResult from "../GlobalResult";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION, prefersReducedMotion } from "@/lib/animation";

interface Props {
  panel?: boolean;
}

const GlobalSearch = ({ panel = false }: Props) => {
  const router = useRouter();
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
    document.addEventListener("click", handleOutSideClick);
    return () => {
      document.removeEventListener("click", handleOutSideClick);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURL = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newURL, { scroll: false });
      } else {
        if (query) {
          const newURL = removeUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newURL, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, searchParams, router, query]);

  const inputRefG = useRef<HTMLInputElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".filterIconG", {
        opacity: 0,
        scale: 0.7,
        rotate: -15,
        duration: 0.45,
        ease: "back.out(2)",
        clearProps: "all",
      });
      gsap.from(inputRefG.current, {
        opacity: 0,
        x: -8,
        duration: 0.35,
        delay: 0.05,
        ease: MOTION.ease,
        clearProps: "all",
      });
    },
    { scope: searchContainerRef },
  );

  return (
    <div
      className={
        panel ? "relative w-full" : "relative w-full max-w-[600px] max-lg:hidden"
      }
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer filterIconG"
        />

        <Input
          ref={inputRefG}
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
      {isOpen && <GlobalResult panel={panel} />}
    </div>
  );
};

export default GlobalSearch;
