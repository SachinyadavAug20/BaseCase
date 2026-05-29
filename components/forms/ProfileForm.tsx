import { IUser } from "@/dataBase/user.model"
import { ProfileSchema } from "@/lib/validation";
import { useRouter } from "next/navigation"
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const ProfileForm =({user}:{user:IUser}) => {
  const router=useRouter();
  const [isPending,startTransaction]=useTransition();
  const form=useForm<z.infer<typeof ProfileSchema>>({
  })
  return (
    <div>form</div>
  )
}

export default ProfileForm
