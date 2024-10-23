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

@Entity()
export class Chatbot extends BaseModel {
  @Column()
  name: string;

  @OneToMany(() => ChatbotMessages, (message) => message.chatbot)
  messages: ChatbotMessages[];

  @ManyToOne(() => User, (user) => user.chatbots)
  user: User;

  @ManyToMany(() => Book)
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
}
