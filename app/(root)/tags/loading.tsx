import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </section>

      <div className="mt-10 grid w-full grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((tag) => {
          return (
            <Skeleton
              key={tag}
              className="h-48 w-full rounded-2xl background-light900_dark300!"
            />
          );
        })}
      </div>
    </>
  );
};

export default loading;
