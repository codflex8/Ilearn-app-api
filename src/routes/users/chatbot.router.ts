import { Router } from "express";
import {
  addBooksToChatbot,
  addChatbots,
  addMessage,
  addMessageHandler,
  deleteChatbot,
  getChatbotById,
  getChatbotMessages,
  getChatbots,
  updateChatbot,
} from "../../controllers/users/chatbot.controller";
import { validateData } from "../../middleware/validationMiddleware";
import {
  refineChatbotMessageValidator,
  chatBotValidator,
  addBooksToChatbotValidator,
} from "../../utils/validators/ChatbotValidator";
import { upload } from "../../middleware/uploadFiles";

const router = Router();
router.get("/", getChatbots);
router.post("/", validateData(chatBotValidator), addChatbots);
router.get("/:id", getChatbotById);
router.put("/:id", validateData(chatBotValidator), updateChatbot);
router.delete("/:id", deleteChatbot);
router.get("/:id/messages", getChatbotMessages);
router.post(
  "/:id/messages",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "record", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateData(refineChatbotMessageValidator),
  addMessageHandler
);
router.post(
  "/:id/books",
  validateData(addBooksToChatbotValidator),
  addBooksToChatbot
);

export default router;
