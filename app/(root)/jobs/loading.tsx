import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 mb-6">Jobs</h1>

      <div className="flex w-full gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1 rounded-lg" /> {/* Search Input */}
        <Skeleton className="h-14 w-full max-w-[210px] rounded-lg max-sm:max-w-full" />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="background-light900_dark200 light-border flex flex-col gap-6 rounded-2xl border p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 items-start gap-4 sm:items-center">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl max-sm:h-12 max-sm:w-12" />

              <div className="flex flex-1 flex-col gap-2.5">
                <Skeleton className="h-6 w-1/2 max-w-[300px] rounded" />{" "}
                {/* Job Title */}
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-24 rounded" /> {/* Company Name */}
                  <Skeleton className="h-4 w-20 rounded" /> {/* Location */}
                </div>
              </div>
            </div>

            <div className="flex justify-end max-sm:w-full">
              <Skeleton className="h-10 w-28 rounded-lg max-sm:w-full" />
            </div>
          </div>
        ))}
      </section>

      <div className="mt-6 flex w-full justify-center gap-3">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </>
  );
};

export default loading;
