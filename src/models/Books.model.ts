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
import { Quiz } from "./Quiz.model";

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId" })
  category: Category;

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

  @ManyToMany(() => Quiz)
  @JoinTable({
    name: "QuizBooks",
    joinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "quizId",
      referencedColumnName: "id",
    },
  })
  quizes: Quiz[];

  static getUserBookById(userId: string, bookId: string) {
    return this.findOne({
      where: {
        id: bookId,
        user: { id: userId },
      },
      relations: {
        category: true,
      },
    });
  }
}
