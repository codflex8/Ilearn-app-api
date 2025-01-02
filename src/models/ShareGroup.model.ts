import { Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { GroupsChat } from "./GroupsChat.model";
import { User } from "./User.model";

@Entity()
export class ShareGroup extends BaseModel {
  @ManyToOne(() => User, (user) => user.shareGroups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @ManyToOne(() => GroupsChat, (group) => group.shareGroups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  group: GroupsChat;
}
