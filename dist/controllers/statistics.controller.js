"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeStatistcs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Dates_1 = require("../utils/Dates");
const User_model_1 = require("../models/User.model");
exports.getHomeStatistcs = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { todayEnd, todayStart } = (0, Dates_1.getTodayDates)();
    const queryResult = await User_model_1.User.getRepository()
        .createQueryBuilder("user")
        .leftJoin("user.books", "book")
        .leftJoin("user.quizes", "quize")
        .select("user.id", "userId")
        .addSelect("user.booksGoal", "booksGoal")
        .addSelect("user.examsGoal", "examsGoal")
        .addSelect("COUNT(DISTINCT book.id)", "booksCount")
        .addSelect("COUNT(DISTINCT quize.id)", "examsCount")
        .addSelect(`CASE 
            WHEN user.booksGoal > 0 THEN (COUNT(DISTINCT book.id) / user.booksGoal) * 100
            ELSE 0
        END`, "booksPercentage")
        .addSelect(`CASE 
            WHEN user.examsGoal > 0 THEN (COUNT(DISTINCT quize.id) / user.examsGoal) * 100
            ELSE 0
        END`, "examsPercentage")
        .where("user.id = :userId", { userId: user.id })
        .andWhere("book.createdAt BETWEEN :todayStart AND :todayEnd", {
        todayStart,
        todayEnd,
    })
        .andWhere("quize.createdAt BETWEEN :todayStart AND :todayEnd", {
        todayStart,
        todayEnd,
    })
        .getRawOne();
    res.status(200).json({
        booksPercentage: parseFloat(queryResult.booksPercentage),
        examsPercentage: parseFloat(queryResult.examsPercentage),
        booksCount: parseInt(queryResult.booksCount, 10),
        examsCount: parseInt(queryResult.examsCount, 10),
        booksGoal: parseInt(queryResult.booksGoal, 10),
        examsGoal: parseInt(queryResult.examsGoal, 10),
    });
});
//# sourceMappingURL=statistics.controller.js.map