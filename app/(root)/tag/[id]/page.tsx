import { RouteParamas } from "@/types/global"

const page =async ({params}:RouteParamas) => {
  const {id}=await params
  return (
    <div>Tag {id}</div>
  )
}

export default page
