import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { GroupsChatMessages } from "./GroupsChatMessages.model";
import { User } from "./User.model";
import { GroupsChatUsers } from "./GroupsChatUsers.model";

@Entity()
export class GroupsChat extends BaseModel {
  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @Column({ nullable: true })
  backgroundCoverUrl: string;

  @OneToMany(() => GroupsChatMessages, (chat) => chat.group)
  messages: GroupsChatMessages[];

  @OneToMany(
    () => GroupsChatUsers,
    (groupsChatUsers) => groupsChatUsers.groupChat
  )
  userGroupsChats: GroupsChatUsers[];

  @ManyToMany(() => User)
  @JoinTable({
    name: "GroupsChatUsers",
    inverseJoinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "chatId",
      referencedColumnName: "id",
    },
  })
  users: User[];

  static getUserGroupChatById(userId: string, id: string) {
    return this.getRepository()
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.users", "users")
      .leftJoinAndSelect("chat.userGroupsChats", "userGroupsChats")
      .where("chat.id = :id", { id })
      .andWhere("userGroupsChats.userId = :userId", { userId })
      .select("chat")
      .addSelect("userGroupsChats")
      .addSelect([
        "users.id",
        "users.email",
        "users.phoneNumber",
        "users.username",
        "users.gender",
        "users.imageUrl",
        "users.gender",
        "users.birthDate",
      ])
      .getOne();
  }
}
