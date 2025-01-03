"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersStatisticsReminder = exports.getProfileStatistics = exports.getHomeStatistcs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Dates_1 = require("../utils/Dates");
const User_model_1 = require("../models/User.model");
const Books_model_1 = require("../models/Books.model");
const typeorm_1 = require("typeorm");
const Quiz_model_1 = require("../models/Quiz.model");
const i18next_1 = __importDefault(require("i18next"));
const sendNotification_1 = require("../utils/sendNotification");
const Notification_model_1 = require("../models/Notification.model");
const ShareGroup_model_1 = require("../models/ShareGroup.model");
// import { getWeeksInMonth } from "date-fns";
var ReportType;
(function (ReportType) {
    ReportType["daily"] = "daily";
    ReportType["weekly"] = "weekly";
    ReportType["monthly"] = "monthly";
})(ReportType || (ReportType = {}));
exports.getHomeStatistcs = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { startWeekDate, endWeekDate } = (0, Dates_1.currentWeekDates)();
    const weekPercentageData = await Books_model_1.Book.getUserGoalPercentage({
        booksGoal: user.booksGoal,
        startDate: startWeekDate,
        endDate: endWeekDate,
        userId: user.id,
    });
    const days = (0, Dates_1.getWeekDays)(startWeekDate);
    const dailyData = await Promise.all(days.map(async ({ startDay, endDay }, index) => {
        const todayPercentage = await Books_model_1.Book.getUserGoalPercentage({
            booksGoal: user.booksGoal,
            startDate: startDay,
            endDate: endDay,
            userId: user.id,
        });
        return { index, todayPercentage };
    }));
    res.status(200).json({ weekPercentageData, dailyData });
});
exports.getProfileStatistics = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { date, reportType } = req.query;
    const { endDate, startDate } = getReportsStartAndEndDate(date, reportType);
    // const monthWeeks = getWeeksInMonth(new Date(date));
    // console.log("monthWeeksssss", monthWeeks);
    const booksPercentage = await Books_model_1.Book.getUserGoalPercentage({
        userId: user.id,
        booksGoal: reportType === ReportType.monthly ? user.booksGoal * 4 : user.booksGoal,
        endDate,
        startDate,
    });
    const examsPercentage = await Quiz_model_1.Quiz.getQuizesPercentage({
        userId: user.id,
        examsGoal: reportType === ReportType.monthly ? user.examsGoal * 4 : user.examsGoal,
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
});
const getReportsStartAndEndDate = (date, reportType) => {
    let startDate;
    let endDate;
    if (reportType === ReportType.monthly) {
        const { monthEnd, monthStart } = (0, Dates_1.getMonthStartAndEndDates)(date);
        startDate = monthStart;
        endDate = monthEnd;
    }
    else if (reportType === ReportType.weekly) {
        const { startWeekDate, endWeekDate } = (0, Dates_1.currentWeekDates)(date);
        startDate = startWeekDate;
        endDate = endWeekDate;
    }
    else {
        const { dayEnd, dayStart } = (0, Dates_1.getDayStartAndEndDates)(date);
        startDate = dayStart;
        endDate = dayEnd;
    }
    console.log("dayEnd, dayStart", startDate, endDate);
    return { startDate, endDate };
};
const getExcitementPoints = async ({ endDate, startDate, user, reportType, examsPercentage, booksPercentage, }) => {
    const shareGroup = await ShareGroup_model_1.ShareGroup.count({
        where: {
            user: { id: user.id },
            createdAt: (0, typeorm_1.Between)(startDate, endDate),
        },
    });
    const shareGroupScale = 4;
    const enthusiasmPoints = ((booksPercentage / 100) * 0.4 +
        (examsPercentage / 100) * 0.4 +
        Math.min(shareGroup /
            (reportType === ReportType.monthly
                ? shareGroupScale * 4
                : shareGroupScale), 1) *
            0.2) *
        100;
    return enthusiasmPoints;
};
const usersStatisticsReminder = async () => {
    const { endDate, startDate } = getReportsStartAndEndDate(new Date(), ReportType.weekly);
    const statisticsQuery = User_model_1.User.getRepository()
        .createQueryBuilder("user")
        .leftJoin("user.books", "book", "book.createdAt BETWEEN :startDate AND :endDate")
        .leftJoin("user.quizes", "quiz", "quiz.createdAt BETWEEN :startDate AND :endDate")
        .select("user.id", "userId")
        .addSelect("COUNT(DISTINCT book.id)", "booksCount")
        .addSelect("user.booksGoal", "booksGoal")
        .addSelect("user.booksGoal", "booksGoal")
        .addSelect("user.username", "username")
        .addSelect("user.fcm", "fcm")
        .addSelect("user.language", "language")
        .addSelect("CASE WHEN user.booksGoal > 0 THEN (COUNT(DISTINCT book.id) / user.booksGoal) * 100 ELSE 0 END", "booksPercentage")
        .addSelect("COUNT(DISTINCT quiz.id)", "examsCount")
        .addSelect("user.examsGoal", "examsGoal")
        .addSelect("CASE WHEN user.examsGoal > 0 THEN (COUNT(DISTINCT quiz.id) / user.examsGoal) * 100 ELSE 0 END", "examsPercentage")
        .groupBy("user.id")
        .setParameters({ startDate, endDate });
    const userStatistics = await statisticsQuery.getRawMany();
    await Promise.all(userStatistics.map(async (user) => {
        var _a;
        const t = i18next_1.default.getFixedT((_a = user.language) !== null && _a !== void 0 ? _a : "en");
        const title = t("weekly_reminder_title");
        const body = t("weekly_reminder_body", {
            booksPercentage: user.booksPercentage,
            examsPercentage: user.examsPercentage,
        });
        await (0, sendNotification_1.sendAndCreateNotification)({
            title,
            body,
            fcmTokens: [user.fcm],
            users: [{ id: user.userId }],
            type: Notification_model_1.NotificationType.StatisticsReminder,
            data: {},
            createNotification: false,
        });
    }));
    return userStatistics;
};
exports.usersStatisticsReminder = usersStatisticsReminder;
//# sourceMappingURL=statistics.controller.js.map