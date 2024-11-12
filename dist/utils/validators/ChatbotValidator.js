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
    record: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    from: zod_1.z.nativeEnum(MessageFrom),
});
exports.refineChatbotMessageValidator = chatbotMessageValidator.refine((data) => data.message || data.record || data.image, {
    message: "can not add empty message",
    path: ["message || record || image"],
});
//# sourceMappingURL=ChatbotValidator.js.map