"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotEvents = void 0;
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const chatbotEvents = (socket) => {
    socket.emit("chatbot-event", { test: "chatbot-event" });
    socket.on("chatbot-new-message", async (data, next) => {
        const user = socket.user;
        await (0, chatbot_controller_1.addMessage)({
            chatbotId: data.chatbotId,
            message: data.message,
            from: data.from,
            userId: user.id,
            errorHandler: (error) => next({ error: error.message }),
        });
    });
};
exports.chatbotEvents = chatbotEvents;
//# sourceMappingURL=chatbots.websocket.js.map