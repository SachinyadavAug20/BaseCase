import ROUTES from "@/constant/routes";
import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Props {
  id: string;
  name: string;
  imageUrl?: string|null;
  className?: string;
  fallbackclassName?:string
}
const UserAvatar = ({ id, name, imageUrl, className = "h-9 w-9",fallbackclassName }: Props) => {
  const initials=name?.split(" ").map((word)=>word[0]).join("").toUpperCase().slice(0,2)
  return (
    <Link href={`${ROUTES.PROFILE}/${id}`}>
      <Avatar className={`${className}`} >
      {imageUrl ? (

        <>
        <AvatarImage
          src={imageUrl}
          alt={name}
          className="rounded-full"
        />
        <AvatarFallback>{name}</AvatarFallback></>
      ) : (
        <AvatarFallback className={`primary-gradient ${fallbackclassName} rounded-full w-9 h-9 text-center pt-1 font-logofont font-bold tracking-wider text-white`}>{initials}</AvatarFallback>
      )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
