import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import ROUTES from "@/constant/routes";
import NavLinks from "./navbar/NavLinks";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

const Leftsidebar = async() => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <section className="custom-scrollbar background-light900_dark300 light-border sticky top-0 left-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks userId={userId}/>
      </div>
      <div className="flex flex-col gap-3">
        {!userId && (
          <div className="flex flex-col gap-3 ">
            <Button
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none background-light900_dark200! text-dark500_light700!"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="account"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Link>
            </Button>

            <Button
              className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none background-light700_dark400! text-dark500_light400!"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="signup"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Link>
            </Button>
          </div>
        )}
        {userId &&(
          <form action={async()=>{
            "use server"
            await signOut()
          }}>
            <Button type="submit" className="base-medium w-fit bg-transparent! px-4 py-3">
            <LogOut className="size-5 text-black dark:text-white"/>
            <span className="max-lg:hidden text-dark300_light900">
              Logout</span>
            </Button>
          </form>
        )}
        {/*session.status === "authenticated" && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <Button
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none background-light900_dark200! text-dark500_light700!"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src={`${session.data.user?.image}`}
                  alt="account"
                  width={25}
                  height={25}
                  className="invert-colors rounded-4xl"
                />
                <span className="primary-text-gradient max-lg:hidden max-lg:hidden">
                  {session.data.user?.name}
                </span>
              </Link>
            </Button>
            <div>
              <form
                className="pt-1"
                action={async () => {
                  await signOut({ redirectTo: ROUTES.SIGN_IN });
                }}
              >
                <Button type="submit">Log out</Button>
              </form>
            </div>
          </div>
        )*/}
      </div>
    </section>
  );
};

export default Leftsidebar;
