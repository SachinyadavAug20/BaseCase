import Leftsidebar from "@/components/navigation/Leftsidebar";
import MobileTabBar from "@/components/navigation/MobileTabBar";
import Navbar from "@/components/navigation/navbar";
import RightSideBar from "@/components/navigation/RightSideBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <MobileTabBar />
      <div className="flex">
        <Leftsidebar />
        <section className="flex min-h-screen flex-1 flex-col px-4 pb-28 pt-28 sm:px-6 sm:pt-32 lg:px-14 lg:pb-8 lg:pt-36">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSideBar />
      </div>
    </main>
  );
};

export default layout;
