import { Socket } from "socket.io";
import {
  IChatbotMessage,
  refineChatbotMessageValidator,
} from "../utils/validators/ChatbotValidator";
import { addMessage } from "../controllers/chatbot.controller";
import schemaValidator from "../utils/schemaValidator";

export const chatbotEvents = (socket: Socket) => {
  socket.on("chatbot-new-message", async (data: IChatbotMessage, next) => {
    const user = socket.user;
    console.log("chatbot-new-message", data);
    try {
      schemaValidator(refineChatbotMessageValidator, data);
      await addMessage({
        chatbotId: data.chatbotId,
        message: data.message,
        from: data.from,
        userId: user.id,
        errorHandler: (error) => next({ error: error.message }),
      });
    } catch (error: any) {
      next(error.message);
    }
  });
};
