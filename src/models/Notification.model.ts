import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";

export enum NotificationType {
  JoinGroupRequest = "JoinGroupRequest",
  UserAcceptJoinGroup = "UserAcceptJoinGroup",
  AdminAcceptJoinGroupRequest = "AdminAcceptJoinGroupRequest",
  NewGroupChatMessage = "NewGroupChatMessage",
  StatisticsReminder = "StatisticsReminder",
  UserAddedTOGroupChat = "UserAddedTOGroupChat",
}

@Entity()
export class Notification extends BaseModel {
  @Column()
  title: string;

  @Column({ type: "enum", enum: NotificationType, nullable: true })
  type: NotificationType;

  @Column()
  body: string;

  @Column({ type: "json" })
  data: Record<string, string>;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "from_user_id" })
  fromUser: User;

  @ManyToOne(() => GroupsChat)
  group: GroupsChat;

  @Column({ type: "boolean", default: false })
  seen: boolean;

  @Column({ type: "boolean", default: false })
  acceptRequest: boolean;

  public static async createNewNotification({
    title,
    body,
    data,
    users,
    group,
    fromUser,
    type,
  }: {
    title: string;
    body: string;
    users: User[];
    group?: GroupsChat;
    fromUser?: User;
    data: Record<string, string>;
    type: NotificationType;
  }) {
    const newNotifications = users.map((user) =>
      this.create({
        title,
        body,
        user: { id: user.id },
        group,
        fromUser,
        data,
        type,
      })
    );
    Notification.save(newNotifications);
    return newNotifications;
  }

  public static async getUnseenNotifications(userId: string) {
    return await Notification.count({
      where: {
        seen: false,
        user: {
          id: userId,
        },
      },
    });
  }
}
