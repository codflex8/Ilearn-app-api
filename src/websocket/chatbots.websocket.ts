import { Socket } from "socket.io";
import { IChatbotMessage } from "../utils/validators/ChatbotValidator";

export const chatbotEvents = (io: Socket) => {
  io.emit("chatbot-event", { test: "chatbot-event" });

  io.on("chatbot-new-message", (data: IChatbotMessage) => {});
};
