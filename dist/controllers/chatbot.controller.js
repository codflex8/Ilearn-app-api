"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.addBooksToChatbot = exports.addMessageHandler = exports.getChatbotMessages = exports.deleteChatbot = exports.updateChatbot = exports.addChatbots = exports.getChatbotById = exports.getChatbots = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ChatBot_model_1 = require("../models/ChatBot.model");
const typeorm_1 = require("typeorm");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ChatBotMessages_model_1 = require("../models/ChatBotMessages.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const Books_model_1 = require("../models/Books.model");
exports.getChatbots = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, name, bookId, categoryId, fromDate, toDate } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let querable = ChatBot_model_1.Chatbot.getChatbotQuerable({
        userId: user.id,
        name,
        bookId,
        categoryId,
        fromDate,
        toDate,
    });
    const chatbots = await querable.skip(skip).take(take).getMany();
    const count = await querable.getCount();
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(page, take, count, chatbots));
});
exports.getChatbotById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    const chatbot = await ChatBot_model_1.Chatbot.getUserChatbotById(user.id, id);
    res.status(200).json({ chatbot });
});
exports.addChatbots = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, booksIds } = req.body;
    const user = req.user;
    const books = await Books_model_1.Book.find({
        where: {
            user: {
                id: user.id,
            },
            id: (0, typeorm_1.In)(booksIds),
        },
    });
    const chatbot = await ChatBot_model_1.Chatbot.create({
        name,
        user,
        books,
    });
    await chatbot.save();
    res.status(200).json({ chatbot });
});
exports.updateChatbot = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, booksIds } = req.body;
    const { id } = req.params;
    const user = req.user;
    const chatbot = await ChatBot_model_1.Chatbot.getUserChatbotById(user.id, id);
    if (!chatbot) {
        next(new ApiError_1.default("chatbot not found", 404));
    }
    const books = await Books_model_1.Book.find({
        where: {
            user: {
                id: user.id,
            },
            id: (0, typeorm_1.In)(booksIds),
        },
    });
    chatbot.name = name;
    chatbot.books = books;
    await chatbot.save();
    res.status(200).json({ chatbot });
});
exports.deleteChatbot = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    const chatbot = await ChatBot_model_1.Chatbot.getUserChatbotById(user.id, id);
    if (!chatbot) {
        next(new ApiError_1.default("chatbot not found", 404));
    }
    await chatbot.remove();
    res.status(200).json({ message: "delete success" });
});
exports.getChatbotMessages = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { page, pageSize } = req.query;
    const user = req.user;
    const { id } = req.params;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const chatbot = await ChatBot_model_1.Chatbot.findOne({
        where: {
            id: (0, typeorm_1.Equal)(id),
            user: {
                id: user.id,
            },
        },
    });
    if (!chatbot) {
        next(new ApiError_1.default("chatbot not found", 404));
    }
    const condition = {
        chatbot: {
            id: (0, typeorm_1.Equal)(id),
        },
    };
    const [messages, count] = await ChatBotMessages_model_1.ChatbotMessages.findAndCount({
        where: condition,
        take,
        skip,
        relations: {
            bookmark: true,
        },
        order: {
            createdAt: "DESC",
        },
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, messages));
});
exports.addMessageHandler = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { message, recordUrl, fileUrl, from } = req.body;
    const newMessage = await (0, exports.addMessage)({
        message,
        recordUrl,
        fileUrl,
        from,
        chatbotId: id,
        userId: user.id,
        errorHandler: next,
    });
    res.status(201).json({ message: newMessage });
});
exports.addBooksToChatbot = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { booksIds } = req.body;
    const user = req.user;
    const chatbot = await ChatBot_model_1.Chatbot.getUserChatbotById(user.id, id);
    if (!chatbot) {
        next(new ApiError_1.default("chatbot not found", 404));
    }
    const books = await Books_model_1.Book.find({
        where: {
            user: {
                id: user.id,
            },
            id: (0, typeorm_1.In)(booksIds),
        },
    });
    chatbot.books = [...chatbot.books, ...books];
    await chatbot.save();
    res.status(200).json({ chatbot });
});
const addMessage = async ({ chatbotId, message, recordUrl, fileUrl, from, userId, errorHandler, }) => {
    const chatbot = await ChatBot_model_1.Chatbot.findOne({
        where: {
            id: (0, typeorm_1.Equal)(chatbotId),
            user: {
                id: userId,
            },
        },
    });
    if (!chatbot) {
        errorHandler(new ApiError_1.default("chatbot not found", 404));
    }
    const newMessage = ChatBotMessages_model_1.ChatbotMessages.create({
        message,
        recordUrl,
        fileUrl,
        chatbot,
        from,
    });
    await newMessage.save();
    return newMessage;
};
exports.addMessage = addMessage;
//# sourceMappingURL=chatbot.controller.js.map