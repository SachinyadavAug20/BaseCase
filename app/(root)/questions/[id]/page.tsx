import { RouteParamas } from "@/types/global"

const page = async ({params}:RouteParamas) => {
  const {id}=await params;
  return (
    <div>Question Details {id}</div>
  )
}

export default page
