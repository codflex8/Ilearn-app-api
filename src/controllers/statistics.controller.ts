import { NextFunction, Response, Request } from "express";
import expressAsync from "express-async-handler";
import {
  currentWeekDates,
  getDayStartAndEndDates,
  getMonthStartAndEndDates,
  getWeekDays,
  getWeeksInMonth,
  weekStartsOn,
} from "../utils/Dates";
import { User } from "../models/User.model";
import { Book } from "../models/Books.model";
import { Between } from "typeorm";
import { Quiz } from "../models/Quiz.model";
// import { getWeeksInMonth } from "date-fns";

enum ReportType {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}
export const getHomeStatistcs = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { startWeekDate, endWeekDate } = currentWeekDates();
    const weekPercentageData = await Book.getUserGoalPercentage({
      booksGoal: user.booksGoal,
      startDate: startWeekDate,
      endDate: endWeekDate,
      userId: user.id,
    });
    const days = getWeekDays(startWeekDate);
    const dailyData = await Promise.all(
      days.map(async ({ startDay, endDay }, index) => {
        const todayPercentage = await Book.getUserGoalPercentage({
          booksGoal: user.booksGoal,
          startDate: startDay,
          endDate: endDay,
          userId: user.id,
        });
        return { index, todayPercentage };
      })
    );
    res.status(200).json({ weekPercentageData, dailyData });
  }
);

export const getProfileStatistics = expressAsync(
  async (
    req: Request<{}, {}, {}, { date: Date; reportType: ReportType }>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const { date, reportType } = req.query;
    const { endDate, startDate } = getReportsStartAndEndDate(date, reportType);
    // const monthWeeks = getWeeksInMonth(new Date(date));
    // console.log("monthWeeksssss", monthWeeks);
    const booksPercentage = await Book.getUserGoalPercentage({
      userId: user.id,
      booksGoal:
        reportType === ReportType.monthly ? user.booksGoal * 4 : user.booksGoal,
      endDate,
      startDate,
    });

    const examsPercentage = await Quiz.getQuizesPercentage({
      userId: user.id,
      examsGoal:
        reportType === ReportType.monthly ? user.examsGoal * 4 : user.examsGoal,
      endDate,
      startDate,
    });
    res.status(200).json({ booksPercentage, examsPercentage });
  }
);

const getReportsStartAndEndDate = (date: Date, reportType: ReportType) => {
  let startDate: Date;
  let endDate: Date;
  if (reportType === ReportType.monthly) {
    const { monthEnd, monthStart } = getMonthStartAndEndDates(date);
    startDate = monthStart;
    endDate = monthEnd;
  } else if (reportType === ReportType.weekly) {
    const { startWeekDate, endWeekDate } = currentWeekDates(date);
    startDate = startWeekDate;
    endDate = endWeekDate;
  } else {
    const { dayEnd, dayStart } = getDayStartAndEndDates(date);
    startDate = dayStart;
    endDate = dayEnd;
  }
  console.log("dayEnd, dayStart", startDate, endDate);
  return { startDate, endDate };
};
