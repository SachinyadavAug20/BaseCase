import ROUTES from "@/constant/routes";
import { getDeviconsClassName } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { getTechDescription } from "@/constant/techmap";
import { Question } from "@/dataBase";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: Boolean;
  compact?: Boolean;
  remove?: Boolean;
  isButton?: Boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconsClassName(name);
  const iconDesc = getTechDescription(name);
  const TagBody = (
    <>
      <Badge className="subtle-medium background-light900_dark300! text-dark500_light700! rounded-md border-none px-2 py-3 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2 ">
          {iconClass && <i className={`${iconClass} text-sm`}></i>}
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={12}
            height={12}
            onClick={handleRemove}
            className="cursor-pointer object-contain invert-0 dark:invert"
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button
        className="flex justify-between gap-2"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {TagBody}
      </button>
    ) : (
      <Link
        href={`${ROUTES.TAG}/${_id}`}
        className="flex justify-between gap-1"
      >
        {TagBody}
      </Link>
    );
  }
  return (
    <Link href={`${ROUTES.TAGS}/${_id}`} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-65">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={`${iconClass} text-2xl`} aria-hidden="true" />
        </div>
        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {iconDesc}
        </p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">{questions}+</span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
