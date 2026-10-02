import Theme from "./Theme";
import MobileNavbar from "./MobileNavbar";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import GlobalSearch from "@/components/search/GlobalSearch";
import MobileSearch from "@/components/search/MobileSearch";
import Logo from "./logo";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 dark:shadow-none fixed z-50 w-full gap-3 px-4 py-4 sm:px-6 lg:px-12">
      <Logo />
      <GlobalSearch />
      <MobileSearch />
      <div className="flex-between gap-4 sm:gap-5">
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
