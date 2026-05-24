import { Skeleton } from "@/components/ui/skeleton";
import ROUTES from "@/constant/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const loading = () => {
  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </section>
      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((q) => (
          <div key={q}>
            <Skeleton className="card-wrapper rounded-[10px] p-9 sm:px-11" />
          </div>
        ))}
      </div>
    </>
  );
};

export default loading;
