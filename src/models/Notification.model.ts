import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";

@Entity()
export class Notification extends BaseModel {
  @Column()
  title: string;

  @Column()
  message: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "from_user_id" })
  fromUser: User;

  @ManyToOne(() => GroupsChat)
  group: GroupsChat;

  public static async createNewNotification({
    message,
    user,
    group,
  }: {
    message: string;
    user: User;
    group?: GroupsChat;
  }) {
    const newNotification = await this.create({
      message,
      user,
      group,
    });
    newNotification.save();
    return newNotification;
  }
}
