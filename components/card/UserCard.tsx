import { IUser } from "@/types/global";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constant/routes";

const UserCard = ({
  _id,
  name,
  image,
  username,
}: IUser) => {
  return (
    <div className="shadow-light100_darknone h-full w-full">
      <article className="background-light900_dark200 light-border flex h-full w-full flex-col items-center justify-center rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-1 sm:p-8">
        <UserAvatar
          id={_id}
          name={name}
          imageUrl={image}
          className="size-[84px] rounded-full object-cover sm:size-[100px]"
          fallbackclassName="text-4xl w-full! h-full! pt-4! sm:text-5xl sm:pt-6!"
        />
        <Link href={`${ROUTES.PROFILE}/${_id}`}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;
