import Link from "next/link";
import Image from "next/image";
import Theme from "./Theme";
import MobileNavbar from "./MobileNavbar";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import GlobalSearch from "@/components/search/GlobalSearch";

const Navbar =async () => {
  const session = await auth();
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-light-300">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt="Devflow logo"
          width={23}
          height={23}
        />
        <p className="h2-bold font-logofont text-dark-100 dark:text-light-900 max-sm:hidden">
          Base<span className="text-primary-500">Case</span>
        </p>
      </Link>
      <GlobalSearch/>
      <div className="flex-between gap-5"><Theme/></div>
      {session?.user?.id && (
        <UserAvatar
        id={session.user.id}
        name={session.user.name!}
        imageUrl={session.user?.image}
        />
      )}
      <MobileNavbar/>

    </nav>
  );
};

export default Navbar;
