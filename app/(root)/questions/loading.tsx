import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center gap-4">
          
          <div className="flex items-center justify-start gap-1">
            <Skeleton className="size-[36px] rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-end items-center gap-2 max-sm:w-full">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        <Skeleton className="mt-3.5 h-9 w-4/5" />
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>

      <div className="w-full space-y-4 rounded-xl border p-5">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-[95%]" />
        
        <div className="my-3 space-y-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-4">
          <Skeleton className="h-13 w-1/3" />
          <Skeleton className="h-13 w-1/4" />
          <Skeleton className="h-13 w-1/2" />
        </div>
        
        <Skeleton className="h-14 w-[85%]" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      <section className="my-5 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      <section className="my-5 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </section>
    </>
  );
};

export default Loading;
