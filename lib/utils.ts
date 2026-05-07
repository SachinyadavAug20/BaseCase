import { getDevIcon } from "@/constant/techmap"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconsClassName=(techName:string)=>{
  return getDevIcon(techName)
}

export const getsTimeStamp = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);

  const units = [
    { label: "year", value: 365 * 24 * 60 * 60 },
    { label: "month", value: 30 * 24 * 60 * 60 },
    { label: "week", value: 7 * 24 * 60 * 60 },
    { label: "day", value: 24 * 60 * 60 },
    { label: "hour", value: 60 * 60 },
    { label: "minute", value: 60 },
    { label: "second", value: 1 },
  ];

  for (const unit of units) {
    const count = Math.floor(seconds / unit.value);
    if (count >= 1) {
      return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
