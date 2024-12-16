import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { ChatbotMessages } from "./ChatBotMessages.model";
import { Book } from "./Books.model";
import { User } from "./User.model";
import { MessageType } from "../utils/validators/GroupsChatValidator";

@Entity()
export class Chatbot extends BaseModel {
  @Column()
  name: string;

  @OneToMany(() => ChatbotMessages, (message) => message.chatbot, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  messages: ChatbotMessages[];

  @ManyToOne(() => User, (user) => user.chatbots, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @ManyToMany(() => Book, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable({
    name: "ChatbotsBooks",
    inverseJoinColumn: {
      name: "chatbotId",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
  })
  books: Book[];

  static getUserChatbotById(userId: string, chatbotId: string) {
    return this.findOne({
      where: {
        id: chatbotId,
        user: { id: userId },
      },
      relations: {
        books: true,
        messages: true,
      },
    });
  }

  static getChatbotQuerable({
    userId,
    name,
    bookId,
    categoryId,
    fromDate,
    toDate,
    messageType,
  }: {
    userId: string;
    name?: string;
    bookId?: string;
    categoryId?: string;
    fromDate?: Date | string;
    toDate?: Date | string;
    messageType?: MessageType;
  }) {
    let querable = Chatbot.getRepository()
      .createQueryBuilder("chatbot")
      .leftJoin("chatbot.user", "user")
      .leftJoinAndSelect("chatbot.books", "book")
      .leftJoin("book.category", "category")
      .where("user.id = :userId", { userId });

    if (name) {
      querable = querable.andWhere("LOWER(chatbot.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (bookId) {
      querable = querable.andWhere("book.id = :bookId", { bookId });
    }

    if (categoryId) {
      querable = querable.andWhere("category.id = :categoryId", { categoryId });
    }

    if (fromDate && toDate) {
      querable = querable.andWhere(
        "DATE(chatbot.createdAt) BETWEEN :fromDate AND :toDate",
        {
          fromDate,
          toDate,
        }
      );
    } else {
      if (fromDate) {
        querable = querable.andWhere("DATE(chatbot.createdAt) >= :fromDate", {
          fromDate,
        });
      }

      if (toDate) {
        querable = querable.andWhere("DATE(chatbot.createdAt) <= :toDate", {
          toDate,
        });
      }
    }

    if (messageType) {
      if (messageType === MessageType.images) {
        querable = querable.andWhere("messages.imageUrl Is Not Null");
      }
      if (messageType === MessageType.records) {
        querable = querable.andWhere("messages.recordUrl Is Not Null");
      }
      if (messageType === MessageType.files) {
        querable = querable.andWhere("messages.fileUrl Is Not Null");
      }
      // if (messageType === MessageType.links) {
      //   querable = querable.andWhere("messages.isLink = 1");
      // }
    }

    return querable.orderBy("chatbot.createdAt", "DESC");
  }
}
