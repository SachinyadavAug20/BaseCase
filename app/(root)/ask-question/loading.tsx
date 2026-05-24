import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9 ">
      <Skeleton className="w-full h-screen"/>
      </div>
    </div>
  );
}

export default loading
