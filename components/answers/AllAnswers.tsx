import { ActionResponse, IAnswer } from "@/types/global";
import DataRenderer from "../DataRenderer";
import { EMPTY_ANSWERS } from "@/constant/states";
import { Answers } from "@/dataBase";
import AnswerCard from "../card/AnswerCard";
import CommonFilter from "../filters/CommonFilter";
import { AnswerFilters } from "@/constant/filter";
import Pagination from "../Pagination";

interface Props extends ActionResponse<IAnswer[]> {
  page?: number;
  pageSize?: number;
  isNext?: boolean;
}

const AllAnswers = ({ data, success, error,page,pageSize,isNext=false }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex flex-col items-start justify-between">
      <div className="flex items-center w-full justify-between">
        <h3 className="primary-text-gradient">
          {data?.length} {data?.length === 1 ? " Answer" : " Answers"}
        </h3>
        <CommonFilter filters={AnswerFilters} otherClasses="sm:min-w-32" containerClasses="max-xs:w-full"/>
        </div>
        <DataRenderer
          data={data}
          error={error}
          empty={EMPTY_ANSWERS}
          sucess={success}
          render={(ans)=>(
            ans.map((a)=>(
              <AnswerCard key={a._id} {...a} />
            ))
          )}
        />
      </div>
            <Pagination page={page} isNext={isNext || false}/>

    </div>
  );
};

export default AllAnswers;
