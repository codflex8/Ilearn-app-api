import { Router } from "express";
import {
  addChatbots,
  addMessage,
  deleteChatbot,
  getChatbotById,
  getChatbotMessages,
  getChatbots,
  updateChatbot,
} from "../controllers/chatbot.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  refineChatbotMessageValidator,
  chatBotValidator,
} from "../utils/validators/ChatbotValidator";

const router = Router();
router.get("/", getChatbots);
router.post("/", validateData(chatBotValidator), addChatbots);
router.get("/:id", getChatbotById);
router.put("/:id", validateData(chatBotValidator), updateChatbot);
router.delete("/:id", deleteChatbot);
router.get("/:id/messages", getChatbotMessages);
router.post(
  "/:id/messages",
  validateData(refineChatbotMessageValidator),
  addMessage
);

export default router;
