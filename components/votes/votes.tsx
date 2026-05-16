"use client";
import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { HasVotedResponse } from "@/types/action";
import { ActionResponse } from "@/types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useId, useState } from "react";
import { toast } from "sonner";

interface Props {
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
  targetType: "question" | "answer";
  targetId: string;
}

const Votes = ({
  targetType,
  targetId,
  upvotes,
  downvotes,
  hasVotedPromise,
}: Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const { success, data } = use(hasVotedPromise);
  const [isLoading, setIsLoading] = useState(false);
  const { hasUpvoted, hasDownvoted } = data || {};
  console.log(data);

  const handleVote = async (voteType:'upvote'|'downvote') => {
    if (!userId)
      return toast.error("Please login to vote", {
        description: "You need to be logged in to vote",
      });
    setIsLoading(true);
    try {
      const result=await createVote({
        targetId,targetType,voteType
      })
      if(!result.success){
        return toast.error("Failed to vote",{
          description:`Something went wrong, please try again ${result.error?.message}`
        })
      }
      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"}`
          : `Downvote ${!hasDownvoted ? "added" : "removed"}`;
      toast.success(successMessage, {
        description: "Your vote has been successfully casted",
      });
    } catch (error) {
      toast.error("Failed to vote", {
        description: `Something went wrong, please try again ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"} `}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 p-1 rounded-sm">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={success && hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"} `}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 p-1 rounded-sm">
          <p className=" subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
