import {
  addDays,
  endOfDay,
  endOfWeek,
  startOfWeek,
  startOfDay,
  startOfMonth,
  endOfMonth,
  getISOWeek,
  getWeek,
} from "date-fns";

export const weekStartsOn = 6;

export const getDayStartAndEndDates = (date: Date = new Date()) => {
  const dayStart = startOfDay(new Date(date));
  // dayStart.setHours(0, 0, 0, 0);

  const dayEnd = endOfDay(new Date(date));
  // dayEnd.setHours(23, 59, 59, 999);
  return { dayStart, dayEnd };
};

export const getMonthStartAndEndDates = (date: Date = new Date()) => {
  const monthStart = startOfMonth(new Date(date));
  // dayStart.setHours(0, 0, 0, 0);

  const monthEnd = endOfMonth(new Date(date));
  // dayEnd.setHours(23, 59, 59, 999);
  return { monthStart, monthEnd };
};

export const currentWeekDates = (date: Date = new Date()) => {
  // Define your week start day (e.g., Sunday or Monday)
  const startWeekDate = startOfWeek(new Date(date), { weekStartsOn }); // Monday as start of the week
  const endWeekDate = endOfWeek(new Date(date), { weekStartsOn });
  console.log(`Week starts on: ${startWeekDate}`);
  console.log(`Week ends on: ${endWeekDate}`);

  return { startWeekDate, endWeekDate };
};

export const getWeekDays = (startWeekDate: Date) => {
  const daysInWeek = 7;

  const days = Array.from({ length: daysInWeek }, (_, i) => {
    const dayStart = addDays(startWeekDate, i);
    return {
      startDay: dayStart,
      endDay: endOfDay(dayStart),
    };
  });
  return days;
};

export function getWeeksInMonth(date: Date): number {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  // Get ISO week numbers for start and end of the month
  const startWeek = getWeek(start);
  const endWeek = getWeek(end);

  // Handle edge case for years where ISO weeks reset
  return endWeek >= startWeek
    ? endWeek - startWeek + 1
    : 53 - startWeek + endWeek + 1;
}
