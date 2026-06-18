import Link from "next/link";
import Image from "next/image";
import Theme from "./Theme";
import MobileNavbar from "./MobileNavbar";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import GlobalSearch from "@/components/search/GlobalSearch";
import Logo from "./logo";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-light-300">
        <Logo/>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
      </div>
      {session?.user?.id && (
        <UserAvatar
          id={session.user.id}
          name={session.user.name!}
          imageUrl={session.user?.image}
        />
      )}
      <MobileNavbar />
    </nav>
  );
};

export default Navbar;
