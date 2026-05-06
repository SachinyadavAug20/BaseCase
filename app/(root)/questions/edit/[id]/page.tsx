import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constant/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParamas } from "@/types/global";
import { notFound, redirect } from "next/navigation";

const page =async ({params}:RouteParamas) => {
  const {id}=await params;
  if(!id) return notFound();
  const session=await auth();
  if(!session) return redirect(ROUTES.SIGN_IN)
  const {data:question,success}=await getQuestion({questionId:id})
  if(!success) return notFound()
  if(question?.author.toString()!==session?.user?.id) redirect(`${ROUTES.QUESTIONS}/${id}`);

  return (
    <main>
        <QuestionForm question={question} isEdit/>
    </main>
  );
};

export default page;
