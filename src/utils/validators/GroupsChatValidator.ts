import { z } from "zod";

export const groupsChatUsersValidator = z.object({
  usersIds: z.array(z.string()),
});

export const addGroupChatValidator = z.object({
  name: z.string(),
  usersIds: z.array(z.string()).default([]),
});

export const updateGroupChatValidator = addGroupChatValidator.extend({
  muteNotification: z.boolean().default(false),
  backgroundColor: z.string().optional().nullable(),
});

export enum GroupChatRoles {
  Admin = "admin",
  Member = "member",
  ReadOnly = "ReadOnly",
}
