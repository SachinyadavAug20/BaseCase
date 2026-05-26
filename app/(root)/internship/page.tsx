import { RouteParamas } from "@/types/global";

const page = async ({ searchParams }: RouteParamas) => {
  const { query, page, location } = await searchParams;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Internship</h1>
    </>
  );
};

export default page;
