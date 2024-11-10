"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const ChatbotValidator_1 = require("../utils/validators/ChatbotValidator");
const router = (0, express_1.Router)();
router.get("/", chatbot_controller_1.getChatbots);
router.post("/", (0, validationMiddleware_1.validateData)(ChatbotValidator_1.chatBotValidator), chatbot_controller_1.addChatbots);
router.get("/:id", chatbot_controller_1.getChatbotById);
router.put("/:id", (0, validationMiddleware_1.validateData)(ChatbotValidator_1.chatBotValidator), chatbot_controller_1.updateChatbot);
router.delete("/:id", chatbot_controller_1.deleteChatbot);
router.get("/:id/messages", chatbot_controller_1.getChatbotMessages);
router.post("/:id/messages", (0, validationMiddleware_1.validateData)(ChatbotValidator_1.refineChatbotMessageValidator), chatbot_controller_1.addMessage);
router.post("/:id/books", (0, validationMiddleware_1.validateData)(ChatbotValidator_1.addBooksToChatbotValidator), chatbot_controller_1.addBooksToChatbot);
exports.default = router;
//# sourceMappingURL=chatbot.router.js.map