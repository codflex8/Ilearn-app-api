import { Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { GroupsChat } from "./GroupsChat.model";
import { User } from "./User.model";

@Entity()
export class Report extends BaseModel {
  @ManyToOne(() => GroupsChat, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  group: GroupsChat;

  @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user: User;
}
