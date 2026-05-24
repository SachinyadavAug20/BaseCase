import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constant/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ask Question | BaseCase",
  description:"BaseCase is a free, open-source, and community-driven platform for developers to share their knowledge and expertise in a simple and easy-to-use format.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};
const page =async () => {
  const session=await auth();
  if(!session) return redirect(ROUTES.SIGN_IN)

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9 ">
        <QuestionForm />
      </div>
    </div>
  );
};

export default page;
