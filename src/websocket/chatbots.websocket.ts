import { Socket } from "socket.io";
import {
  IChatbotMessage,
  refineChatbotMessageValidator,
} from "../utils/validators/ChatbotValidator";
import { addMessage } from "../controllers/chatbot.controller";
import schemaValidator from "../utils/schemaValidator";

export const chatbotEvents = (socket: Socket) => {
  socket.on("chatbot-new-message", async (data: IChatbotMessage, callback) => {
    const user = socket.user;
    try {
      schemaValidator(refineChatbotMessageValidator, data);
      const message = await addMessage({
        chatbotId: data.chatbotId,
        message: data.message,
        from: data.from,
        userId: user.id,
        errorHandler: (error) => {
          if (callback) callback({ message: error.message });
        },
        translate: socket.t,
      });
      callback({ status: "success", message });
    } catch (error: any) {
      if (callback) callback({ message: error.message });
    }
  });
};
