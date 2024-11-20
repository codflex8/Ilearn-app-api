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

  unreadMessagesCount: number;

  static isGroupChatExist(id: string, userId: string) {
    return this.getRepository().exists({
      where: {
        id,
        userGroupsChats: {
          user: {
            id: userId,
          },
        },
      },
    });
  }

  static getUserGroupChatById(userId: string, id: string) {
    return this.getRepository()
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.userGroupsChats", "userGroupsChats")
      .leftJoinAndSelect("userGroupsChats.user", "user")
      .where("chat.id = :id", { id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("ugc.groupChat.id")
          .from(GroupsChatUsers, "ugc")
          .where("ugc.user.id = :userId", { userId })
          .getQuery();
        return `chat.id IN ${subQuery}`;
      })
      .select("chat")
      .addSelect("userGroupsChats")
      .addSelect([
        "user.id",
        "user.email",
        "user.phoneNumber",
        "user.username",
        "user.gender",
        "user.imageUrl",
        "user.birthDate",
      ])
      .getOne();
  }
}
