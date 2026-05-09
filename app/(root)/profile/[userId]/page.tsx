import { RouteParamas } from "@/types/global";

const page = async ({params}:RouteParamas) => {
  const {userId}=await params;

  return (
    <div>Profile {userId}</div>
  )
}

export default page
