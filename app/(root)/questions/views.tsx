"use client"

import { incrementViews } from "@/lib/actions/question.action"
import { useEffect } from "react"
import { toast } from "sonner"

const Views = ({questionId}:{questionId:string}) => {
  const handleIncremenr=async()=>{
    const response=await incrementViews({questionId});
    if(response.success){
      toast.success("Success",{
        description:"Increase views",
      })
    }else{
      toast.error("Error",{
        description:response.error?.message,
      })
    }
  }
  useEffect(()=>{
    handleIncremenr();
  },[]);
  return null
}

export default Views
