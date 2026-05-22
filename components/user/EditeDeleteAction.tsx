"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constant/routes";
import { deleteUserItem } from "@/lib/actions/user.action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditeDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const handleEdit = async () => {
    router.push(`${ROUTES.QUESTIONS}/edit/${itemId}`);
  };
  const handleDelete = async () => {
    if(type==='question'){
      // call api action to delete question
      await deleteUserItem({itemId,type});
      toast.success("Question deleted successfully",{
        description: "Your question has been deleted successfully"
      })
    }else if(type==='answer'){
      // call api action to delete question
      await deleteUserItem({itemId,type});
      toast.success("Answer deleted successfully",{
        description: "Your Answer has been deleted successfully"
      })
    }
  };
  return (
    <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type==='answer' && "gap-0 justify-center"}`}>
      {type === "question" && (
        <Image
          src="/icons/edit.svg"
          width={14}
          height={14}
          alt="edit"
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild className="cursor-pointer">
          <Button variant="outline">
            <Image
              src="/icons/trash.svg"
              width={14}
              height={14}
              alt="delete"
              className="object-contain"
            />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              {type==='question'?"question":"answer"} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="border-primary-100! bg-primary-100! text-light400_light600!">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditeDeleteAction;
