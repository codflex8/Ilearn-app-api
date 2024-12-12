import { z } from "zod";
export enum MessageType {
  messages = "messages",
  images = "images",
  records = "records",
  files = "files",
  links = "links",
}

export const groupsChatUsersValidator = z.object({
  usersIds: z.array(z.string()),
});

export const acceptJoinRequestValidator = z.object({
  userId: z.string(),
});

export const addGroupChatValidator = z.object({
  name: z.string(),
  usersIds: z.array(z.string()).nullable().default([]),
});

export const updateGroupChatValidator = addGroupChatValidator.extend({
  muteNotification: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  backgroundColor: z.string().optional().nullable(),
});

export const newGroupChatMessageValidator = z
  .object({
    message: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    record: z.string().optional().nullable(),
    file: z.string().optional().nullable(),
  })
  .refine((data) => data.message || data.record || data.image || data.file, {
    message: "can not add empty message",
    path: ["message || record || image || file"],
  });

export enum GroupChatRoles {
  Admin = "admin",
  Member = "member",
  ReadOnly = "ReadOnly",
}
