"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotEvents = void 0;
const chatbotEvents = (io) => {
    io.emit("chatbot-event", { test: "chatbot-event" });
};
exports.chatbotEvents = chatbotEvents;
//# sourceMappingURL=chatbots.websocket.js.map