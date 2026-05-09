import ROUTES from "@/constant/routes";
import { getDeviconsClassName } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "@mdxeditor/editor";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  NO_question?: number;
  showCount?: Boolean;
  compact?: Boolean;
  remove?: Boolean;
  isButton?: Boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  NO_question,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconsClassName(name);
  const TagBody = (
    <>
      <Badge className="subtle-medium background-light900_dark300! text-dark500_light700! rounded-md border-none px-2 py-3 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2 ">
        {iconClass &&
          <i className={`${iconClass} text-sm`}></i>
        }
          <span>{name}</span>
        </div>
        {remove && (
          <Image src="/icons/close.svg" alt="close" width={12} height={12} onClick={handleRemove} className="cursor-pointer object-contain invert-0 dark:invert"/>
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{NO_question}</p>
      )}
    </>
  );

  return isButton? (
    <button className="flex justify-between gap-2" onClick={(e)=>{e.preventDefault()}}>
      {TagBody}
    </button>
  ):(
    <Link href={`${ROUTES.TAG}/${_id}`} className="flex justify-between gap-1">
      {TagBody}
    </Link>
  );
};

export default TagCard;
