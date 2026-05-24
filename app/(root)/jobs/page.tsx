import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Jobs | BaseCase",
  description:"BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

const page = () => {
  return (
    <div>Jobs</div>
  )
}

export default page
