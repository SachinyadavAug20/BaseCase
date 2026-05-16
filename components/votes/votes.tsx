"use client";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useId, useState } from "react";
import { toast } from "sonner";

interface Props {
  upvotes: number;
  downvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasUpVoted, hasDownVoted }: Props) => {
  const session = useSession();
  const user = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: string) => {
    if (!useId)
      return toast.error("Please login to vote", {
        description: "You need to be logged in to vote",
      });
    setIsLoading(true);
    try {
      const successMessage =
        voteType === "up"
          ? `Upvote ${!hasUpVoted ? "added" : "removed"}`
          : `Downvote ${!hasDownVoted ? "added" : "removed"}`;
      toast.success(successMessage,{
        description:"Your vote has been successfully casted",
      })
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
          src={hasUpVoted ? "/icons/upvoted.svg" : "/icon/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"} `}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("up")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 p-1 rounded-sm">
          <p className=" subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownVoted ? "/icons/downvoted.svg" : "/icon/downvote.svg"}
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"} `}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("down")}
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
