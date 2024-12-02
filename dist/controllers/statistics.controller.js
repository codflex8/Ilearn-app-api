"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileStatistics = exports.getHomeStatistcs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Dates_1 = require("../utils/Dates");
const Books_model_1 = require("../models/Books.model");
const Quiz_model_1 = require("../models/Quiz.model");
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
    res.status(200).json({ booksPercentage, examsPercentage });
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
//# sourceMappingURL=statistics.controller.js.map