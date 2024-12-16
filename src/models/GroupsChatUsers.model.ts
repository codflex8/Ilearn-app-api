import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";
import { GroupChatRoles } from "../utils/validators/GroupsChatValidator";
import { BaseModel } from "./BaseModel";

@Entity("groups_chat_users")
export class GroupsChatUsers extends BaseModel {
  @Column({ type: "boolean", default: false })
  muteNotification: boolean;

  @Column({ type: "boolean", default: false })
  acceptJoin: boolean;

  @Column({ type: "enum", enum: GroupChatRoles, nullable: true })
  role: GroupChatRoles;

  @ManyToOne(() => User, (user) => user.userGroupsChats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  //   @JoinColumn()
  user: User;

  @ManyToOne(() => GroupsChat, (chat) => chat.userGroupsChats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  //   @JoinColumn()
  groupChat: GroupsChat;
}
