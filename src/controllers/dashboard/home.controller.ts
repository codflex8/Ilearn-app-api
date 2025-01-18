import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../../models/User.model";
import { Book } from "../../models/Books.model";
import { Quiz } from "../../models/Quiz.model";
import { Chatbot } from "../../models/ChatBot.model";
import { GroupsChat } from "../../models/GroupsChat.model";
import { UserStatus } from "../../utils/validators/AuthValidator";
import { UsersActivities } from "../../models/UsersActivities.model";
import { startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { getDailyActivity, getMonthName } from "../../utils/getMonthName";

export const home = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allUsersCountQuery = User.count();
    const activeUsersCountQuery = User.count({
      where: { status: UserStatus.active },
    });
    const uploadedBooksCountQuery = Book.count();
    const quizesCountQuery = Quiz.count();
    const chatbotsCountQuery = Chatbot.count();

    const startOftheYear = startOfYear(today);
    const endOftheYear = endOfYear(today);
    const monthsOfTheYear = eachMonthOfInterval({
      start: "2024-12-31",
      end: "2025-12-31",
    });
    console.log("monthsOfTheYear", {
      startOftheYear,
      endOftheYear,
      monthsOfTheYear,
    });

    // Calculate the start of the range (3 months before the current month)
    const startDate = new Date(today.getFullYear(), today.getMonth() - 4, 1);
    // Calculate the end of the range (the current month)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const activityDataQuery = UsersActivities.createQueryBuilder("activity")
      .select([
        "YEAR(activity.date) AS year",
        "MONTH(activity.date) AS month",
        "SUM(activity.count) AS totalCount",
      ])
      .where("activity.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .groupBy("YEAR(activity.date), MONTH(activity.date)")
      .orderBy("YEAR(activity.date), MONTH(activity.date)")
      .getRawMany();

    // const dailyUsersActivityQuery = UsersActivities.createQueryBuilder(
    //   "activity"
    // )
    //   .select([
    //     "YEAR(activity.date) AS year",
    //     "MONTH(activity.date) AS month",
    //     "DAY(activity.date) AS day",
    //     "SUM(activity.count) AS totalCount",
    //   ])
    //   .where("activity.date BETWEEN :startDate AND :endDate", {
    //     startDate,
    //     endDate,
    //   })
    //   .groupBy("YEAR(activity.date), MONTH(activity.date), DAY(activity.date)")
    //   .orderBy("YEAR(activity.date), MONTH(activity.date), DAY(activity.date)")
    //   .getRawMany();

    const groupsChatDataQuery = GroupsChat.createQueryBuilder("group")
      .leftJoin("group.userGroupsChats", "userGroup")
      .select("Count(userGroup.id)", "usersCount")
      .addSelect("group.name", "groupName")
      .groupBy("group.id")
      .getRawMany();

    const usersDataQuery = User.createQueryBuilder("user")
      .select(
        "COUNT(CASE WHEN user.status = 'active' THEN 1 END)",
        "activeUsersCount"
      )
      .addSelect(
        "COUNT(CASE WHEN user.status = 'unactive' THEN 1 END)",
        "unactiveUsersCount"
      )
      .getRawOne();

    const [
      allUsersCount,
      activeUsersCount,
      uploadedBooksCount,
      quizesCount,
      chatbotsCount,
      groupsChatData,
      usersData,
      activityData,
      // dailyUsersActivity,
    ] = await Promise.all([
      allUsersCountQuery,
      activeUsersCountQuery,
      uploadedBooksCountQuery,
      quizesCountQuery,
      chatbotsCountQuery,
      groupsChatDataQuery,
      usersDataQuery,
      activityDataQuery,
      // dailyUsersActivityQuery,
    ]);
    // Generate all months in the range
    const allMonths = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      allMonths.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1, // Months are 0-indexed in JavaScript
        totalCount: 0, // Default value,
        monthName: getMonthName(current.getMonth() + 1),
      });
      current.setMonth(current.getMonth() + 1); // Increment month
    }
    // Merge the database results with the full range
    const mergedData = allMonths.map((month) => {
      const found = activityData.find(
        (activity) =>
          activity.year === month.year && activity.month === month.month
      );
      return { ...month, ...found }; // Use activity data if found; otherwise, use the default
    });

    // const dailyActivity = getDailyActivity(
    //   dailyUsersActivity,
    //   startDate.getFullYear(),
    //   startDate.getMonth()
    // );

    res.status(200).json({
      allUsersCount,
      activeUsersCount,
      uploadedBooksCount,
      quizesCount,
      chatbotsCount,
      groupsChatData,
      usersData,
      activityData: mergedData,
      // dailyUsersActivity,
      // dailyActivity,
    });
  }
);
