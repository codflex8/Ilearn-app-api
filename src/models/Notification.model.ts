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
    title,
    message,
    users,
    group,
    fromUser,
  }: {
    title: string;
    message: string;
    users: User[];
    group?: GroupsChat;
    fromUser?: User;
  }) {
    const newNotifications = users.map((user) =>
      this.create({
        title,
        message,
        user,
        group,
        fromUser,
      })
    );
    Notification.save(newNotifications);
    return newNotifications;
  }
}
