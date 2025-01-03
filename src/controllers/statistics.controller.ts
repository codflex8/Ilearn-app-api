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
import i18next from "i18next";
import { sendAndCreateNotification } from "../utils/sendNotification";
import { NotificationType } from "../models/Notification.model";
import { ShareGroup } from "../models/ShareGroup.model";
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

    const getExcitementPoin = await getExcitementPoints({
      booksPercentage: booksPercentage.percentage,
      examsPercentage: examsPercentage.percentage,
      reportType,
      user,
      endDate,
      startDate,
    });
    res
      .status(200)
      .json({ booksPercentage, examsPercentage, getExcitementPoin });
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

const getExcitementPoints = async ({
  endDate,
  startDate,
  user,
  reportType,
  examsPercentage,
  booksPercentage,
}: {
  examsPercentage: number;
  booksPercentage: number;
  user: User;
  startDate: Date;
  endDate: Date;
  reportType: ReportType;
}) => {
  const shareGroup = await ShareGroup.count({
    where: {
      user: { id: user.id },
      createdAt: Between(startDate, endDate),
    },
  });
  const shareGroupScale = 4;
  const enthusiasmPoints =
    ((booksPercentage / 100) * 0.4 +
      (examsPercentage / 100) * 0.4 +
      Math.min(
        shareGroup /
          (reportType === ReportType.monthly
            ? shareGroupScale * 4
            : shareGroupScale),
        1
      ) *
        0.2) *
    100;

  return enthusiasmPoints;
};

export const usersStatisticsReminder = async () => {
  const { endDate, startDate } = getReportsStartAndEndDate(
    new Date(),
    ReportType.weekly
  );

  const statisticsQuery = User.getRepository()
    .createQueryBuilder("user")
    .leftJoin(
      "user.books",
      "book",
      "book.createdAt BETWEEN :startDate AND :endDate"
    )
    .leftJoin(
      "user.quizes",
      "quiz",
      "quiz.createdAt BETWEEN :startDate AND :endDate"
    )
    .select("user.id", "userId")
    .addSelect("COUNT(DISTINCT book.id)", "booksCount")
    .addSelect("user.booksGoal", "booksGoal")
    .addSelect("user.booksGoal", "booksGoal")
    .addSelect("user.username", "username")
    .addSelect("user.fcm", "fcm")
    .addSelect("user.language", "language")
    .addSelect(
      "CASE WHEN user.booksGoal > 0 THEN (COUNT(DISTINCT book.id) / user.booksGoal) * 100 ELSE 0 END",
      "booksPercentage"
    )
    .addSelect("COUNT(DISTINCT quiz.id)", "examsCount")
    .addSelect("user.examsGoal", "examsGoal")
    .addSelect(
      "CASE WHEN user.examsGoal > 0 THEN (COUNT(DISTINCT quiz.id) / user.examsGoal) * 100 ELSE 0 END",
      "examsPercentage"
    )
    .groupBy("user.id")
    .setParameters({ startDate, endDate });
  const userStatistics = await statisticsQuery.getRawMany();

  await Promise.all(
    userStatistics.map(async (user) => {
      const t = i18next.getFixedT(user.language ?? "en");
      const title = t("weekly_reminder_title");
      const body = t("weekly_reminder_body", {
        booksPercentage: user.booksPercentage,
        examsPercentage: user.examsPercentage,
      });

      await sendAndCreateNotification({
        title,
        body,
        fcmTokens: [user.fcm],
        users: [{ id: user.userId }] as User[],
        type: NotificationType.StatisticsReminder,
        data: {},
        createNotification: false,
      });
    })
  );

  return userStatistics;
};
