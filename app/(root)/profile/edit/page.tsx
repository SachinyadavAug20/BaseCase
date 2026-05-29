import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import ROUTES from "@/constant/routes";
import { IUser, IUserDoc } from "@/dataBase/user.model";
import { getUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const page =async () => {
  const session=await auth();
  if(!session?.user?.id) redirect(ROUTES.SIGN_IN);
  const {success,data}=await getUser({userId:session.user.id});
  if(!success) redirect(ROUTES.SIGN_IN);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <ProfileForm user={data?.user as IUserDoc} />
    </>
  )
}

export default page
