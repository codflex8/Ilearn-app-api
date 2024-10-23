import { z, ZodRawShape } from "zod";

export enum MessageFrom {
  user = "user",
  chatBot = "chatbot",
}

export const chatBotValidator = z.object({
  name: z.string(),
});

const chatbotMessageValidator = z.object({
  message: z.string().optional(),
  recordUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  from: z.nativeEnum(MessageFrom),
});
export const refineChatbotMessageValidator = chatbotMessageValidator.refine(
  (data) => data.message || data.recordUrl || data.fileUrl,
  {
    message: "can not add empty message",
    path: ["message || recordUrl || fileUrl"],
  }
);
