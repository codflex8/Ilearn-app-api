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

export const home = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allUsersCountQuery = User.count();
    const activeUsersCountQuery = User.count({
      where: { status: UserStatus.unactive },
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
    const startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    // Calculate the end of the range (3 months after the current month)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);
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
    ] = await Promise.all([
      allUsersCountQuery,
      activeUsersCountQuery,
      uploadedBooksCountQuery,
      quizesCountQuery,
      chatbotsCountQuery,
      groupsChatDataQuery,
      usersDataQuery,
      activityDataQuery,
    ]);
    // Format the data (optional)
    const formattedData = activityData.map((row) => ({
      year: row.year,
      month: row.month,
      totalCount: row.totalCount,
    }));
    res.status(200).json({
      allUsersCount,
      activeUsersCount,
      uploadedBooksCount,
      quizesCount,
      chatbotsCount,
      groupsChatData,
      usersData,
      activityData,
    });
  }
);
