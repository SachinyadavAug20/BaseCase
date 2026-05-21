import Leftsidebar from "@/components/navigation/Leftsidebar"
import Navbar from "@/components/navigation/navbar"
import RightSideBar from "@/components/navigation/RightSideBar"

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className="background-light850_dark100 relative">
    <Navbar/>
    <div className="flex">
    <Leftsidebar/>
    <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pd-14  sm:px-14">
    <div className="mx-auto w-full max-w-5xl ">{children}</div>
    </section>
    <RightSideBar/>
    </div>
    </main>
  )
}

export default layout
