import { Socket } from "socket.io";
import {
  IChatbotMessage,
  refineChatbotMessageValidator,
} from "../utils/validators/ChatbotValidator";
import { addMessage } from "../controllers/chatbot.controller";
import schemaValidator from "../utils/schemaValidator";
import { toggleBookmark } from "../controllers/bookmark.controller";
import { addBookmarkValidator } from "../utils/validators/BookmarkValidator";

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

  socket.on("toggle-bookmark", async (data, callback) => {
    const user = socket.user;
    try {
      schemaValidator(addBookmarkValidator, data);
      toggleBookmark({
        chatbotMessageId: data.chatbotMessageId,
        questionId: data.questionId,
        translate: socket.t,
        user: socket.user,
      });
      callback({ status: "success" });
    } catch (error: any) {
      if (callback) callback({ message: error.message });
    }
  });
};
