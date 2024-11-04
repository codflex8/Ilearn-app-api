import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";

@Entity()
export class GroupsChatMessages extends BaseModel {
  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  link: string;

  @Column()
  fileUrl: string;

  @ManyToOne(() => GroupsChat)
  group: GroupsChat;

  @ManyToOne(() => User)
  from: User;
}
