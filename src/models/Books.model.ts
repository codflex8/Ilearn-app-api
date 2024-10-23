import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Category } from "./Categories.model";
import { User } from "./User.model";
import { BaseModel } from "./BaseModel";
import { Chatbot } from "./ChatBot.model";

@Entity()
export class Book extends BaseModel {
  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  content: string;

  @ManyToMany(() => Category)
  @JoinTable({
    name: "CategoriesBooks",
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({
    name: "userId",
  })
  user: User;

  @ManyToMany(() => Chatbot)
  @JoinTable({
    name: "ChatbotsBooks",
    joinColumn: {
      name: "chatbotId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
  })
  chatbots: Chatbot[];
}
