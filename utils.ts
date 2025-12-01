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

// Получить количество дней в месяце
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Получить день недели для первого дня месяца (0 = Понедельник, 6 = Воскресенье)
export function getFirstDayOfMonth(year: number, month: number): number {
  const date = new Date(year, month - 1, 1);
  const day = date.getDay();
  // Конвертируем из воскресенья-начала (0-6) в понедельник-начало (0-6)
  return day === 0 ? 6 : day - 1;
}

// Форматировать месяц для отображения
export function formatMonth(year: number, month: number): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[month - 1];
}

// Форматировать месяц для API (например: "jan_2025", "dec_2025")
export function formatMonthId(year: number, month: number): string {
  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  return `${monthNames[month - 1]}_${year}`;
}

// Получить следующий месяц
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

// Получить предыдущий месяц
export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

// Проверить является ли дата сегодняшней
export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}