import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";
import { GroupChatRoles } from "../utils/validators/GroupsChatValidator";
import { BaseModel } from "./BaseModel";

@Entity("GroupsChatUsers")
export class GroupsChatUsers extends BaseModel {
  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "uuid" })
  chatId: string;

  @Column({ type: "boolean", default: false })
  muteNotification: boolean;

  @Column({ type: "enum", enum: GroupChatRoles, nullable: true })
  role: GroupChatRoles;

  @ManyToOne(() => User, (user) => user.userGroupsChats)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => GroupsChat, (chat) => chat.userGroupsChats)
  @JoinColumn({ name: "chatId" })
  groupChat: GroupsChat;
}
