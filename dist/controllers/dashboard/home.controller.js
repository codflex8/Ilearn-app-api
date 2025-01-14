"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = require("../../models/User.model");
const Books_model_1 = require("../../models/Books.model");
const Quiz_model_1 = require("../../models/Quiz.model");
const ChatBot_model_1 = require("../../models/ChatBot.model");
const GroupsChat_model_1 = require("../../models/GroupsChat.model");
const AuthValidator_1 = require("../../utils/validators/AuthValidator");
const UsersActivities_model_1 = require("../../models/UsersActivities.model");
const date_fns_1 = require("date-fns");
const getMonthName_1 = require("../../utils/getMonthName");
exports.home = (0, express_async_handler_1.default)(async (req, res, next) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allUsersCountQuery = User_model_1.User.count();
    const activeUsersCountQuery = User_model_1.User.count({
        where: { status: AuthValidator_1.UserStatus.unactive },
    });
    const uploadedBooksCountQuery = Books_model_1.Book.count();
    const quizesCountQuery = Quiz_model_1.Quiz.count();
    const chatbotsCountQuery = ChatBot_model_1.Chatbot.count();
    const startOftheYear = (0, date_fns_1.startOfYear)(today);
    const endOftheYear = (0, date_fns_1.endOfYear)(today);
    const monthsOfTheYear = (0, date_fns_1.eachMonthOfInterval)({
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
    const activityDataQuery = UsersActivities_model_1.UsersActivities.createQueryBuilder("activity")
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
    const groupsChatDataQuery = GroupsChat_model_1.GroupsChat.createQueryBuilder("group")
        .leftJoin("group.userGroupsChats", "userGroup")
        .select("Count(userGroup.id)", "usersCount")
        .addSelect("group.name", "groupName")
        .groupBy("group.id")
        .getRawMany();
    const usersDataQuery = User_model_1.User.createQueryBuilder("user")
        .select("COUNT(CASE WHEN user.status = 'active' THEN 1 END)", "activeUsersCount")
        .addSelect("COUNT(CASE WHEN user.status = 'unactive' THEN 1 END)", "unactiveUsersCount")
        .getRawOne();
    const [allUsersCount, activeUsersCount, uploadedBooksCount, quizesCount, chatbotsCount, groupsChatData, usersData, activityData,
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
            monthName: (0, getMonthName_1.getMonthName)(current.getMonth() + 1),
        });
        current.setMonth(current.getMonth() + 1); // Increment month
    }
    // Merge the database results with the full range
    const mergedData = allMonths.map((month) => {
        const found = activityData.find((activity) => activity.year === month.year && activity.month === month.month);
        return Object.assign(Object.assign({}, month), found); // Use activity data if found; otherwise, use the default
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
});
//# sourceMappingURL=home.controller.js.map