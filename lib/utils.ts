import { BADGE_CRITERIA } from "@/constant"
import { getDevIcon } from "@/constant/techmap"
import { BadgeCounts } from "@/types/global"
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

export const formatNumber=(number:number)=>{
  if(number>=1000000){
    return (number/1000000).toFixed(1)+"M"
  }else if(number>=1000){
    return (number/1000).toFixed(1)+"K"
  }else{
    return number.toString()
  }
}

export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}) {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level as keyof typeof badgeLevels]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });
  return badgeCounts;
}

export function processJobTitle(title: string | undefined | null): string {
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  const words = title.split(" ");
  const validWords = words.filter((word) => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  if (validWords.length === 0) {
    return "No Job Title";
  }

  const processedTitle = validWords.join(" ");

  return processedTitle;
}

