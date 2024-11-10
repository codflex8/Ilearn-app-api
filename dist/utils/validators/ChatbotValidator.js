"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refineChatbotMessageValidator = exports.addBooksToChatbotValidator = exports.chatBotValidator = exports.MessageFrom = void 0;
const zod_1 = require("zod");
var MessageFrom;
(function (MessageFrom) {
    MessageFrom["user"] = "user";
    MessageFrom["chatBot"] = "chatbot";
})(MessageFrom || (exports.MessageFrom = MessageFrom = {}));
exports.chatBotValidator = zod_1.z.object({
    name: zod_1.z.string(),
    booksIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.addBooksToChatbotValidator = zod_1.z.object({
    booksIds: zod_1.z.array(zod_1.z.string()).optional(),
});
const chatbotMessageValidator = zod_1.z.object({
    message: zod_1.z.string().optional(),
    recordUrl: zod_1.z.string().optional(),
    fileUrl: zod_1.z.string().optional(),
    from: zod_1.z.nativeEnum(MessageFrom),
});
exports.refineChatbotMessageValidator = chatbotMessageValidator.refine((data) => data.message || data.recordUrl || data.fileUrl, {
    message: "can not add empty message",
    path: ["message || recordUrl || fileUrl"],
});
//# sourceMappingURL=ChatbotValidator.js.map