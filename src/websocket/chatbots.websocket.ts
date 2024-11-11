import { Socket } from "socket.io";
import { IChatbotMessage } from "../utils/validators/ChatbotValidator";
import { addMessage } from "../controllers/chatbot.controller";

export const chatbotEvents = (socket: Socket) => {
  socket.emit("chatbot-event", { test: "chatbot-event" });

  socket.on("chatbot-new-message", async (data: IChatbotMessage) => {
    // await addMessage({
    //   chatbotId: data.chatbotId,
    //   message: data.message,
    //   from: data.from,
    // });
  });
};
