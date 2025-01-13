"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBookmark = exports.addBookmark = exports.getBookmarks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Bookmarks_model_1 = require("../../models/Bookmarks.model");
const getPaginationData_1 = require("../../utils/getPaginationData");
const GenericResponse_1 = require("../../utils/GenericResponse");
const ChatBotMessages_model_1 = require("../../models/ChatBotMessages.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const Questions_model_1 = require("../../models/Questions.model");
exports.getBookmarks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, bookId, chatbotId, quizId } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const quereable = await Bookmarks_model_1.Bookmark.createQueryBuilder("bookmark")
        .leftJoin("bookmark.user", "user")
        .leftJoinAndSelect("bookmark.chatbotMessage", "chatbotMessage")
        .leftJoin("chatbotMessage.chatbot", "chatbot")
        .leftJoin("chatbot.books", "chatBotbook")
        .leftJoinAndSelect("bookmark.question", "question")
        .leftJoin("question.quiz", "quiz")
        .leftJoin("quiz.books", "quizBook")
        .where("user.id = :userId", { userId: user.id });
    if (bookId) {
        quereable.andWhere("(chatBotbook.id = :bookId OR quizBook.id = :bookId)", { bookId });
    }
    if (chatbotId) {
        quereable.andWhere("chatbot.id = :chatbotId", { chatbotId });
    }
    if (quizId) {
        quereable.andWhere("quiz.id = :quizId", { quizId });
    }
    const [bookmarks, count] = await quereable
        .skip(skip)
        .take(take)
        .getManyAndCount();
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, bookmarks));
});
exports.addBookmark = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { chatbotMessageId, questionId } = req.body;
    const user = req.user;
    await (0, exports.toggleBookmark)({
        chatbotMessageId,
        questionId,
        user,
        translate: req.t,
    });
    res.status(200).json({ message: req.t("toggle_bookmark_success") });
});
const toggleBookmark = async ({ chatbotMessageId, questionId, user, translate, }) => {
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
            throw new ApiError_1.default(translate("chatbot_message_not_found"), 400);
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
            throw new ApiError_1.default(translate("question_not_found"), 400);
        }
        await handleQuestionBookmark(question, user);
    }
};
exports.toggleBookmark = toggleBookmark;
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