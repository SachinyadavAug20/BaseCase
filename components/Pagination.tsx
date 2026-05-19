import { Button } from "./ui/button";

interface Props {
  page?: number | string | undefined;
  isNext?: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses = "" }: Props) => {
  return (
    <div
      className={`flex w-full items-center justify-center gap-2 ${containerClasses}`}
    >
      {Number(page) > 1 && (
        <Button className="light-border-2 btn min-h-9 flex items-center justify-center gap-2 border">
          <p className="body-medium text-dark200_light800 ">Prev</p>
        </Button>
      )}
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>
      {isNext && (
        <Button className="light-border-2 btn min-h-9 flex items-center justify-center gap-2 border">
          <p className="body-medium text-dark200_light800 ">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
