"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeUrlQuery } from "@/lib/url";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION, prefersReducedMotion } from "@/lib/animation";

interface Props {
  imgSrc: string;
  placeholder: string;
  route: string;
  otherClasses?: string;
  iconsPosition?: "left" | "right";
}

const LocalSearch = ({
  imgSrc,
  placeholder,
  route,
  otherClasses,
  iconsPosition = "left",
}: Props) => {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParmas = useSearchParams();
  const query = searchParmas.get("query") ? searchParmas.get("query") : "";
  const [searchQuery, setSearchQuery] = useState(query);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".filterIcon", {
        opacity: 0,
        scale: 0.7,
        rotate: -15,
        duration: 0.45,
        ease: "back.out(2)",
        clearProps: "all",
      });
      gsap.from(inputRef.current, {
        opacity: 0,
        x: -8,
        duration: 0.35,
        delay: 0.05,
        ease: MOTION.ease,
        clearProps: "all",
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newURL = formUrlQuery({
          params: searchParmas.toString(),
          key: "query",
          value: searchQuery,
        });
        router.push(newURL, { scroll: false }); // page won't scroll to top after redirect
      } else if (pathname === route) {
        const newUrl = removeUrlQuery({
          params: searchParmas.toString(),
          keysToRemove: ["query"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParmas]); // runs when searchQuery changes

  return (
    <div
      ref={containerRef}
      className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconsPosition === "left" && (
        <Image
          src={imgSrc}
          alt="searchQuery icon"
          width={24}
          height={24}
          className="cursor-pointer filterIcon"
        />
      )}

      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={`${searchQuery}`}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      ></Input>
      {iconsPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={15}
          height={15}
          className="cursor-pointer filterIcon"
        />
      )}
    </div>
  );
};

export default LocalSearch;
