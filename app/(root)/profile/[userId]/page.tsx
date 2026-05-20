import { auth } from "@/auth";
import ProfileLinks from "@/components/user/ProfileLinks";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import { RouteParamas } from "@/types/global";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async ({ params }: RouteParamas) => {
  const { userId } = await params;
  if (!userId) notFound();
  const loggedInUser = await auth();
  const { success, data, error } = await getUser({ userId });
  if (!success) {
    return (
      <div className="h1-bold text-dark100_light900">{error?.message}</div>
    );
  }
  const { totalQuestions, totalAnswers, user } = data || {};
  const {
    name,
    username,
    _id,
    image,
    portfolio,
    location,
    reputation,
    createdAt,
    bio,
  } = user!;

  return (
    <section className="flex flex-col-reverse items-start justify-between sm:flex-row!">
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <UserAvatar
          id={_id}
          imageUrl={image}
          name={name}
          className="size-[140px] rounded-full object-cover"
          fallbackclassName="text-[85px] text-center font-bolder w-[140px] h-[140px]"
        />
        <div className="mt-3">
          <h2 className="h2-bold text-dark100_light900">{name}</h2>
          <p className="paragraph-regular text-dark200_light800">@{username}</p>
          <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
            {portfolio && (
              <ProfileLinks
                imgUrl="/icons/link.svg"
                href={portfolio}
                title="Portfolio"
              />
            )}
            {location && (
              <ProfileLinks imgUrl="/icons/link.svg" title="Location" />
            )}
            <ProfileLinks
              imgUrl="/icons/calendar.svg"
              href={portfolio}
              title={dayjs(createdAt).format("MMMM YYYY")}
            />
          </div>
          {bio && (
            <p className="paragraph-regular text-dark400_light800 mt-8">
              {bio}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
        {loggedInUser?.user?.id === _id && (
          <Link href="/profile/edit">
            <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default page;
