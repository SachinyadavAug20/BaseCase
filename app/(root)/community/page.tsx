import UserCard from "@/components/card/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constant/filter";
import ROUTES from "@/constant/routes";
import { EMPTY_COLLECTIONS, EMPTY_USERS } from "@/constant/states";
import { getUsers } from "@/lib/actions/user.action";
import { RouteParamas } from "@/types/global";

const page = async ({ searchParams }: RouteParamas) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
    query,
    filter,
  });
  const {users}=data||{}
  return( <div>
    <h1 className="h1-bold text-dark100_light900">All Users</h1>
    <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearch route={ROUTES.COMMUNITY} iconsPosition="left" imgSrc="/icons/search.svg" placeholder="Search some great devs..." otherClasses="flex-1"/>
      <CommonFilter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"/>
    </div>
    <DataRenderer
      sucess={success}
      error={error}
      empty={EMPTY_USERS}
      data={users}
      render={(users) =>(
        <div className="mt-12 flex flex-wrap gap-5">
          {users.map((u)=>(
            <UserCard key={u._id} {...u}/>
          ))}
        </div>
      )}
    />
  </div>);
};

export default page;
