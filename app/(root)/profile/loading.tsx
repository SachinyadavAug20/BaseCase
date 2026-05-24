import { Skeleton } from "@/components/ui/skeleton";

const ProfileLoading = () => {
  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="size-[150px] rounded-full" />

          <div className="mt-3 flex flex-col gap-3">
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-14 w-64" />

            <div className="mt-5 flex flex-wrap gap-3">
              <Skeleton className="h-14 w-28 rounded-md" />
              <Skeleton className="h-14 w-28 rounded-md" />
              <Skeleton className="h-14 w-35 rounded-md" />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Skeleton className="h-3 w-full max-w-[500px]" />
              <Skeleton className="h-3 w-[90%] max-w-[450px]" />
              <Skeleton className="h-3 w-[80%] max-w-[400px]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end max-sm:w-full sm:mt-3">
          <Skeleton className="h-12 w-40 rounded-md" />
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </section>

      <section className="mt-10 flex gap-10">
        <div className="flex-1">
          <div className="flex gap-3">
            <Skeleton className="h-12 w-28 rounded-md" />
            <Skeleton className="h-12 w-28 rounded-md" />
          </div>

          <div className="mt-6 flex flex-col gap-5">
            {[1, 2, 3,4,5,6,7,8,9].map((i) => (
              <div
                key={i}
                className="rounded-xl border p-5 space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        <aside className="w-full max-w-sm max-lg:hidden">
          <Skeleton className="h-6 w-32" />

          <div className="mt-6 flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
};

export default ProfileLoading;
