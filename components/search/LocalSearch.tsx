"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeUrlQuery } from "@/lib/url";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const router = useRouter();
  const searchParmas = useSearchParams();
  const query = searchParmas.get("query") ? searchParmas.get("query") : "";
  const [searchQuery, setSearchQuery] = useState(query);
  useGSAP(() => {
    gsap.from(".filterIcon", {
      scale: 1.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      rotate: 20,
      ease: "back.out(1.7)",
    });
    gsap.from(inputRef.current, {
      width: 0,
      opacity: 0,
      padding: 0,
      duration: 1.5,
      ease: "back.out(1)",
      transformOrigin: "left center",
    });
  });

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
