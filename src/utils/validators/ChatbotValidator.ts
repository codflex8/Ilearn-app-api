import { z, ZodRawShape } from "zod";
import { BaseQuery } from "./BaseQuery";
import { MessageType } from "./GroupsChatValidator";

export interface ChatbotsQuery extends BaseQuery {
  name: string;
  bookId: string;
  categoryId: string;
  fromDate: Date;
  toDate: Date;
  messageType: MessageType;
}

export enum MessageFrom {
  user = "user",
  chatBot = "chatbot",
}

export const chatBotValidator = z.object({
  name: z.string(),
  booksIds: z.array(z.string()).optional(),
});

export const addBooksToChatbotValidator = z.object({
  booksIds: z.array(z.string()).optional(),
});

export interface IChatbotMessage {
  message: string;
  from: MessageFrom;
  chatbotId: string;
}

const chatbotMessageValidator = z.object({
  message: z.string().optional(),
  record: z.string().optional(),
  image: z.string().optional(),
  from: z.nativeEnum(MessageFrom),
});
export const refineChatbotMessageValidator = chatbotMessageValidator.refine(
  (data) => data.message || data.record || data.image,
  {
    message: "can not add empty message",
    path: ["message || record || image"],
  }
);
