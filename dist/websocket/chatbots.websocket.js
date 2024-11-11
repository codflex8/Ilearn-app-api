"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotEvents = void 0;
const chatbotEvents = (socket) => {
    socket.emit("chatbot-event", { test: "chatbot-event" });
    socket.on("chatbot-new-message", async (data) => {
        // await addMessage({
        //   chatbotId: data.chatbotId,
        //   message: data.message,
        //   from: data.from,
        // });
    });
};
exports.chatbotEvents = chatbotEvents;
//# sourceMappingURL=chatbots.websocket.js.map