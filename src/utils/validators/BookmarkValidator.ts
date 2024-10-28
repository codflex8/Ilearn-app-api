import { z } from "zod";

export const addBookmarkValidator = z
  .object({
    chatbotMessageId: z.string().optional(),
    questionId: z.string().optional(),
  })
  .refine((data) => data.chatbotMessageId || data.questionId, {
    // : ["chatbotMessageId", "questionId"],
    path: ["chatbotMessageId || questionId"],
    message: "one of them required",
  });
