import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (timestamp: number): string => {
  const targetDate = new Date(timestamp);
  const now = new Date();
  const timeDifference = targetDate.getTime() - now.getTime();
  const absTimeDifference = Math.abs(timeDifference);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (absTimeDifference < minute) {
    const seconds = Math.floor(absTimeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (absTimeDifference < hour) {
    const minutes = Math.floor(absTimeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (absTimeDifference < day) {
    const hours = Math.floor(absTimeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (absTimeDifference < week) {
    const days = Math.floor(absTimeDifference / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (absTimeDifference < month) {
    const weeks = Math.floor(absTimeDifference / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (absTimeDifference < year) {
    const months = Math.floor(absTimeDifference / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(absTimeDifference / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return `${num}`;
  }
};

export const getTodaysDate = (): string => {
  return new Date().toISOString();
};
