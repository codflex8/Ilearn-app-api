"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchiveQuizes = exports.getArchiveChatbots = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ChatBot_model_1 = require("../../models/ChatBot.model");
const getDateWithoutTime_1 = require("../../utils/getDateWithoutTime");
const getPaginationData_1 = require("../../utils/getPaginationData");
const GenericResponse_1 = require("../../utils/GenericResponse");
const Quiz_model_1 = require("../../models/Quiz.model");
const getArchiveDates = () => {
    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const previousDate = new Date(yesterdayDate);
    previousDate.setDate(yesterdayDate.getDate() - 1);
    return {
        todayDate: (0, getDateWithoutTime_1.getDateWithoutTime)(todayDate),
        yesterdayDate: (0, getDateWithoutTime_1.getDateWithoutTime)(yesterdayDate),
        previousDate: (0, getDateWithoutTime_1.getDateWithoutTime)(previousDate),
    };
};
exports.getArchiveChatbots = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, page, pageSize, categoryId, bookId } = req.query;
    const user = req.user;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const { todayDate, yesterdayDate, previousDate } = getArchiveDates();
    const todayChatbots = await ChatBot_model_1.Chatbot.getChatbotQuerable({
        userId: user.id,
        name,
        fromDate: todayDate,
        toDate: todayDate,
        categoryId,
        bookId,
    }).getMany();
    const yasterdayChatbots = await ChatBot_model_1.Chatbot.getChatbotQuerable({
        userId: user.id,
        name,
        fromDate: yesterdayDate,
        toDate: yesterdayDate,
        categoryId,
        bookId,
    }).getMany();
    const previousChatbotsQuerable = ChatBot_model_1.Chatbot.getChatbotQuerable({
        userId: user.id,
        name,
        toDate: previousDate,
        categoryId,
        bookId,
    });
    const previousChatbotsCount = await previousChatbotsQuerable.getCount();
    const previousChatbots = await previousChatbotsQuerable
        .skip(skip)
        .take(take)
        .getMany();
    res.status(200).json({
        todayChatbots,
        yasterdayChatbots,
        previousChatbots: new GenericResponse_1.GenericResponse(page, take, previousChatbotsCount, previousChatbots),
    });
});
exports.getArchiveQuizes = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, page, pageSize, categoryId, bookId } = req.query;
    const user = req.user;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const { todayDate, yesterdayDate, previousDate } = getArchiveDates();
    const todayQuizes = await Quiz_model_1.Quiz.getQuizQuerable({
        userId: user.id,
        name,
        fromDate: todayDate,
        toDate: todayDate,
        categoryId,
        bookId,
    }).getMany();
    const yasterdayQuizes = await Quiz_model_1.Quiz.getQuizQuerable({
        userId: user.id,
        name,
        fromDate: yesterdayDate,
        toDate: yesterdayDate,
        categoryId,
        bookId,
    }).getMany();
    const previousQuizesQuerable = Quiz_model_1.Quiz.getQuizQuerable({
        userId: user.id,
        name,
        toDate: previousDate,
        categoryId,
        bookId,
    });
    const previousQuizesCount = await previousQuizesQuerable.getCount();
    const previousQuizes = await previousQuizesQuerable
        .skip(skip)
        .take(take)
        .getMany();
    res.status(200).json({
        todayQuizes,
        yasterdayQuizes,
        previousQuizes: new GenericResponse_1.GenericResponse(page, take, previousQuizesCount, previousQuizes),
    });
});
//# sourceMappingURL=archive.controller.js.map