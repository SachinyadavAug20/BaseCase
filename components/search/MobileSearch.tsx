"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GlobalSearch from "./GlobalSearch";

const MobileSearch = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="background-light800_darkgradient flex size-11 cursor-pointer items-center justify-center rounded-xl lg:hidden"
        >
          <Image
            src="/icons/search.svg"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
        </button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="background-light900_dark200 light-border gap-2 border-b px-4 pb-6 pt-12"
      >
        <SheetTitle className="sr-only">Search</SheetTitle>
        <GlobalSearch panel />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearch;
