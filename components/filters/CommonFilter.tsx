"use client";

import { useSearchParams,useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filter } from "@mdxeditor/editor";
import { formUrlQuery } from "@/lib/url";

interface filter {
  name: string;
  value: string;
}
interface Props {
  filters: filter[];
  otherClasses?: string;
  containerClasses?: string;
}

const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsFilter = searchParams.get("filter");
  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl,{scroll:false})
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={`body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 ${otherClasses}`}
          aria-label="filter options"
        >
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter</SelectLabel>
            {filters.map((f) => (
              <SelectItem key={f.name} value={f.value}>
                {f.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
