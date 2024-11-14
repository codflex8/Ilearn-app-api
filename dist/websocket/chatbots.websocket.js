"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotEvents = void 0;
const ChatbotValidator_1 = require("../utils/validators/ChatbotValidator");
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const schemaValidator_1 = __importDefault(require("../utils/schemaValidator"));
const chatbotEvents = (socket) => {
    socket.on("chatbot-new-message", async (data, callback) => {
        const user = socket.user;
        console.log("chatbot-new-message", data);
        try {
            (0, schemaValidator_1.default)(ChatbotValidator_1.refineChatbotMessageValidator, data);
            await (0, chatbot_controller_1.addMessage)({
                chatbotId: data.chatbotId,
                message: data.message,
                from: data.from,
                userId: user.id,
                errorHandler: (error) => {
                    if (callback)
                        callback({ error: error.message });
                },
            });
        }
        catch (error) {
            if (callback)
                callback(error.message);
        }
    });
};
exports.chatbotEvents = chatbotEvents;
//# sourceMappingURL=chatbots.websocket.js.map