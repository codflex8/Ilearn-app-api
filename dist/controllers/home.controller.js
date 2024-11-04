"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archive = exports.home = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Categories_model_1 = require("../models/Categories.model");
const GenericResponse_1 = require("../utils/GenericResponse");
const Books_model_1 = require("../models/Books.model");
const ChatBot_model_1 = require("../models/ChatBot.model");
const Quiz_model_1 = require("../models/Quiz.model");
const Bookmarks_model_1 = require("../models/Bookmarks.model");
exports.home = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const [categories, categoriesCount] = await Categories_model_1.Category.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    const [books, booksCount] = await Books_model_1.Book.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    res.status(200).json({
        categories: new GenericResponse_1.GenericResponse(Number(1), 10, categoriesCount, categories),
        books: new GenericResponse_1.GenericResponse(Number(1), 10, booksCount, books),
    });
});
exports.archive = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const [chatbots, chatbotsCount] = await ChatBot_model_1.Chatbot.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    const [quizes, quizesCount] = await Quiz_model_1.Quiz.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    const [bookmarks, bookmarksCount] = await Bookmarks_model_1.Bookmark.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        relations: {
            question: true,
            chatbotMessage: true,
        },
        order: {
            createdAt: "DESC",
        },
    });
    res.status(200).json({
        categories: new GenericResponse_1.GenericResponse(Number(1), 10, chatbotsCount, chatbots),
        books: new GenericResponse_1.GenericResponse(Number(1), 10, quizesCount, quizes),
        bookmarks: new GenericResponse_1.GenericResponse(Number(1), 10, bookmarksCount, bookmarks),
    });
});
//# sourceMappingURL=home.controller.js.map