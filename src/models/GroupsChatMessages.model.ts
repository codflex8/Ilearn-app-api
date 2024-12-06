import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Brackets,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { GroupsChat } from "./GroupsChat.model";
import { getServerIPAddress } from "../utils/getServerIpAddress";

@Entity()
export class GroupsChatMessages extends BaseModel {
  @Column({ nullable: true, type: "longtext" })
  message: string;

  @Column({ nullable: true })
  imageUrl: string;
  fullImageUrl: string = null;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setFullImageUrl() {
    if (this.imageUrl) {
      this.fullImageUrl = getServerIPAddress() + this.imageUrl;
    }
  }
  @Column({ nullable: true })
  recordUrl: string;

  @Column({ type: "boolean", default: false })
  isLink: boolean;

  @Column({ nullable: true })
  fileUrl: string;

  @ManyToOne(() => GroupsChat)
  group: GroupsChat;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  from: User;

  @Column({ type: "simple-array", nullable: true })
  readbyIds: string[];

  seen: boolean;

  // @AfterLoad()
  // @AfterInsert()
  // @AfterUpdate()
  // isMessageSeen() {
  //   this.seen = !!this.readbyIds?.find((id) => id === this.id);
  // }

  isSeenMessage(userId: string) {
    this.seen = !!this.readbyIds?.find((id) => id === userId);
  }

  static countChatUreadMessages(chatId: string, userId: string) {
    return GroupsChatMessages.getRepository()
      .createQueryBuilder("message")
      .leftJoin("message.group", "group")
      .where("group.id = :groupId", { groupId: chatId })
      .andWhere(
        new Brackets((qb) => {
          qb.where("message.readbyIds IS NULL") // Include messages with no readbyIds
            .orWhere(
              new Brackets((innerQb) => {
                innerQb
                  .where("message.readbyIds NOT LIKE :middleUserId", {
                    middleUserId: `%,${userId},%`,
                  })
                  .andWhere("message.readbyIds NOT LIKE :startUserId", {
                    startUserId: `${userId},%`,
                  })
                  .andWhere("message.readbyIds NOT LIKE :endUserId", {
                    endUserId: `%,${userId}`,
                  })
                  .andWhere("message.readbyIds != :exactUserId", {
                    exactUserId: userId,
                  });
              })
            );
        })
      )
      .getCount();
  }
}
