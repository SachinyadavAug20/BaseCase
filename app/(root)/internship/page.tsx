import { RouteParamas } from "@/types/global";

const page = async ({ searchParams }: RouteParamas) => {
  const { query, page, location } = await searchParams;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Internship</h1>
      <div className="w-full h-[67vh] flex justify-center items-center">
      <p className="text-5xl text-dark200_light800">Coming soon...</p>
      </div>
    </>
  );
};

export default page;
