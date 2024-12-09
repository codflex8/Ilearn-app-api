"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookmarkValidator = void 0;
const zod_1 = require("zod");
exports.addBookmarkValidator = zod_1.z
    .object({
    chatbotMessageId: zod_1.z.string().optional(),
    questionId: zod_1.z.string().optional(),
})
    .refine((data) => data.chatbotMessageId || data.questionId, {
    // : ["chatbotMessageId", "questionId"],
    path: ["chatbotMessageId || questionId"],
    message: "one of them required",
});
//# sourceMappingURL=BookmarkValidator.js.map