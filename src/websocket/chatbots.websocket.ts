import { Socket } from "socket.io";

export const chatbotEvents = (io: Socket) => {
  io.emit("chatbot-event", { test: "chatbot-event" });
};
