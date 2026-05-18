"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const UserId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    if (isLoading) {
      return toast.info("Please wait");
    }
    if (!UserId) {
      return toast.info("Login to save question", {
        description: "You need to be logged in to save a question",
      });
    }
    setIsLoading(true);
    try {
      const {success,data,error}=await toggleSaveQuestion({questionId})
      if(!success){
        throw new Error(error?.message || 'An error occured while saving question');
      }
      toast.success(`Question ${data?.saved ? 'saved' : 'removed'}`,{
        description: data?.saved ? 'Question saved successfully' : 'Question removed successfully'
      });
    } catch (error) {
      toast.error("Error", {
        description: `Something went wrong, please try again ${error instanceof Error ? error.message : error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [hasSaved, setHasSaved] = useState(false);
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg":"/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"} ml-3`}
      aria-label="Save Question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
