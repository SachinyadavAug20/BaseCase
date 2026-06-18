"use Client";
import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constant/states";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props<T> {
  sucess?: boolean;
  error?: { message: string; details?: Record<string, string[]> };
  data?: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render?: (data: T[]) => React.ReactNode;
}
interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-12">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={420}
        height={420}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.dark}
        alt={image.alt}
        width={420}
        height={420}
        className="object-contain dark:hidden block"
      />
    </>
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
    <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
      {message}
    </p>
    {button && (
      <Link href={button.href}>
        <Button className="paragraph-medium pt-5 mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 cursor-pointer">
          {button.text}
        </Button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  sucess,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  if (!sucess)
    return (
      <StateSkeleton
        image={{
          light: "/images/error.png",
          dark: "/images/error.png",
          alt: "error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details ? JSON.stringify(error.details) : DEFAULT_ERROR.message
        }
        button={empty.button}
      />
    );
  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          light: "/images/no-question-found.png",
          dark: "/images/no-question-found.png",
          alt: "empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
    if(!render){
      return <div>Data render not found!! </div>;
    }
  return render(data);
};

export default DataRenderer;
