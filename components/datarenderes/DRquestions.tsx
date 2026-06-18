"use client";

import { IQuestion } from "@/types/global";
import QuestionCard from "../card/QuestionCard";

const DRquestions = ({q}: {q:IQuestion}) => {
  return (
    <div key={q._id} className="qcard px-2 py-3">
      <QuestionCard question={q} />
    </div>
  );
};

export default DRquestions;
