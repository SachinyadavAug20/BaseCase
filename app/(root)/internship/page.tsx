import {
  fetchCountries,
  fetchIntership,
  fetchLocation,
} from "@/lib/actions/intership.action";
import { RouteParamas } from "@/types/global";

const page = async ({ searchParams }: RouteParamas) => {
  const { query, page, location } = await searchParams;
  const userLocation = await fetchLocation();
  const intership = await fetchIntership({
    query: "",
    page,
  });
  const countries = await fetchCountries();
  const parsedPage = parseInt(page ?? 1);

  console.log(intership);
  return <div>
    
  </div>;
};

export default page;
