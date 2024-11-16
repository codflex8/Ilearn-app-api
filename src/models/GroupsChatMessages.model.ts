import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";

@Entity()
export class GroupsChatMessages extends BaseModel {
  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  recordUrl: string;

  @Column({ type: "boolean", default: false })
  isLink: boolean;

  @Column({ nullable: true })
  fileUrl: string;

  @ManyToOne(() => GroupsChat)
  group: GroupsChat;

  @ManyToOne(() => User)
  from: User;

  @Column({ type: "simple-array", nullable: true })
  readbyIds: string[];

  seen: boolean;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  isMessageSeen() {
    // console.log("this.readbyIds", this.readbyIds, this.id);
    this.seen = !!this.readbyIds?.find((id) => id === this.id);
  }
}
