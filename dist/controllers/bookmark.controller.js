"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookmark = exports.getBookmarks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Bookmarks_model_1 = require("../models/Bookmarks.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const ChatBotMessages_model_1 = require("../models/ChatBotMessages.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Questions_model_1 = require("../models/Questions.model");
const typeorm_1 = require("typeorm");
exports.getBookmarks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, bookId, chatbotId, quizId } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let conditions = {
        user: {
            id: user.id,
        },
    };
    if (bookId) {
        conditions = Object.assign(Object.assign({}, conditions), { question: {
                quiz: {
                    books: {
                        id: (0, typeorm_1.In)([bookId]),
                    },
                },
            } });
    }
    if (chatbotId) {
        conditions = Object.assign(Object.assign({}, conditions), { chatbotMessage: {
                chatbot: {
                    id: (0, typeorm_1.In)([chatbotId]),
                },
            } });
    }
    if (quizId) {
        conditions = Object.assign(Object.assign({}, conditions), { question: {
                quiz: {
                    id: (0, typeorm_1.In)([quizId]),
                },
            } });
    }
    const [bookmarks, count] = await Bookmarks_model_1.Bookmark.findAndCount({
        where: conditions,
        relations: {
            chatbotMessage: true,
            question: true,
        },
        skip,
        take,
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, bookmarks));
});
exports.addBookmark = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { chatbotMessageId, questionId } = req.body;
    const user = req.user;
    if (chatbotMessageId) {
        const chatbotMessage = await ChatBotMessages_model_1.ChatbotMessages.findOne({
            where: {
                id: chatbotMessageId,
                chatbot: {
                    user: {
                        id: user.id,
                    },
                },
            },
        });
        if (!chatbotMessage) {
            return next(new ApiError_1.default("chatbot message not found", 400));
        }
        handleChatbotMessagesBookmark(chatbotMessage, user);
    }
    if (questionId) {
        const question = await Questions_model_1.Question.findOne({
            where: {
                id: questionId,
                quiz: {
                    user: {
                        id: user.id,
                    },
                },
            },
        });
        if (!question) {
            return next(new ApiError_1.default("question not found", 400));
        }
        await handleQuestionBookmark(question, user);
    }
    res.status(200).json({ message: "toggle bookmark Success" });
});
const handleChatbotMessagesBookmark = async (chatbotMessage, user) => {
    const bookmark = await Bookmarks_model_1.Bookmark.findOne({
        where: {
            chatbotMessage: {
                id: chatbotMessage.id,
            },
            user: {
                id: user.id,
            },
        },
    });
    if (bookmark) {
        await bookmark.remove();
        return bookmark;
    }
    else {
        const newBookmark = await Bookmarks_model_1.Bookmark.create();
        newBookmark.user = user;
        newBookmark.chatbotMessage = chatbotMessage;
        await newBookmark.save();
        return newBookmark;
    }
};
const handleQuestionBookmark = async (question, user) => {
    const bookmark = await Bookmarks_model_1.Bookmark.findOne({
        where: {
            question: { id: question.id },
            user: {
                id: user.id,
            },
        },
    });
    if (bookmark) {
        await bookmark.remove();
        return bookmark;
    }
    else {
        const newBookmark = await Bookmarks_model_1.Bookmark.create();
        newBookmark.user = user;
        newBookmark.question = question;
        await newBookmark.save();
        return newBookmark;
    }
};
//# sourceMappingURL=bookmark.controller.js.map