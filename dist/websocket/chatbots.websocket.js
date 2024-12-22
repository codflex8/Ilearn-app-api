"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotEvents = void 0;
const ChatbotValidator_1 = require("../utils/validators/ChatbotValidator");
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const schemaValidator_1 = __importDefault(require("../utils/schemaValidator"));
const bookmark_controller_1 = require("../controllers/bookmark.controller");
const BookmarkValidator_1 = require("../utils/validators/BookmarkValidator");
const chatbotEvents = (socket) => {
    socket.on("chatbot-new-message", async (data, callback) => {
        const user = socket.user;
        try {
            (0, schemaValidator_1.default)(ChatbotValidator_1.refineChatbotMessageValidator, data);
            const message = await (0, chatbot_controller_1.addMessage)({
                chatbotId: data.chatbotId,
                message: data.message,
                from: data.from,
                userId: user.id,
                errorHandler: (error) => {
                    if (callback)
                        callback({ message: error.message });
                },
                translate: socket.t,
            });
            callback({ status: "success", message });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
    socket.on("chatbot-toggle-bookmark", async (data, callback) => {
        const user = socket.user;
        try {
            (0, schemaValidator_1.default)(BookmarkValidator_1.addBookmarkValidator, data);
            (0, bookmark_controller_1.toggleBookmark)({
                chatbotMessageId: data.chatbotMessageId,
                questionId: data.questionId,
                translate: socket.t,
                user: socket.user,
            });
            callback({ status: "success" });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
};
exports.chatbotEvents = chatbotEvents;
//# sourceMappingURL=chatbots.websocket.js.map