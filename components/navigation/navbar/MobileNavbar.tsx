import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constant/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "./NavLinks";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

const MobileNavbar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="Menu"
            className="sm:hidden invert-colors"
          />
        </SheetTrigger>
        <SheetContent
          className="background-light900_dark200 border-none"
          side="left"
        >
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 px-5 pt-6"
          >
            <Image
              src="/images/site-logo.svg"
              alt="Devflow logo"
              width={30}
              height={30}
            />
            <p className="h2-bold font-logofont text-dark-100 dark:text-light-900 ">
              Dev<span className="text-primary-500">Flow</span>
            </p>
          </Link>

          <div className="no-scrollbar flex h-screen flex-col justify-around overflow-hidden px-2 pb-5">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16">
                <NavLinks isMobileNav={true} />
              </section>
            </SheetClose>
            {!userId ? (
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                      <span className="primary-text-gradient ">Log In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_UP}>
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <SheetClose asChild>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button
                    type="submit"
                    className="base-medium w-fit bg-transparent! px-4 py-3"
                  >
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className=" text-dark300_light900">Logout</span>
                  </Button>
                </form>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
