import { Socket } from "socket.io";
import { IChatbotMessage } from "../utils/validators/ChatbotValidator";

export const chatbotEvents = (socket: Socket) => {
  socket.emit("chatbot-event", { test: "chatbot-event" });

  socket.on("chatbot-new-message", (data: IChatbotMessage) => {});
};
