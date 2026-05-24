import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </section>

      <div className="mt-10 flex w-full flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((tag) => {
          return (
            <Badge key={tag} className="subtle-medium mt-11 w-44 h-48 background-light900_dark300! text-dark500_light700! rounded-md border-none px-2 py-3 uppercase flex flex-row gap-2" ></Badge>
          );
        })}
      </div>
    </>
  );
};

export default loading;
