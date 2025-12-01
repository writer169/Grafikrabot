import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonthStats(schedule: any[]) {
  return schedule.reduce(
    (acc, curr) => {
      if (curr.status === 'work') {
        acc.workDays++;
        if (curr.location === 'Тастак') acc.tastakDays++;
        if (curr.location === 'Сарыарка') acc.saryarkaDays++;
      } else {
        acc.offDays++;
      }
      return acc;
    },
    { workDays: 0, offDays: 0, tastakDays: 0, saryarkaDays: 0 }
  );
}