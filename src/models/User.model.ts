import { Column, Entity, OneToMany } from "typeorm";
import { Category } from "./Categories.model";
import { Book } from "./Books.model";
import { GenderEnum } from "../utils/validators/AuthValidator";
import { BaseModel } from "./BaseModel";
import { Chatbot } from "./ChatBot.model";
import { Quiz } from "./Quiz.model";

@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: "datetime", nullable: true })
  birthDate: Date;

  @Column({ type: "enum", nullable: true, enum: GenderEnum })
  gender: GenderEnum;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "datetime", nullable: true })
  passwordChangedAt: Date;

  @Column({ type: "int", nullable: true })
  passwordResetCode: number;

  @Column({ type: "datetime", nullable: true })
  passwordResetExpires: Date;

  @Column({ type: "boolean", default: false })
  passwordResetVerified: Boolean;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizes: Quiz[];

  @OneToMany(() => Chatbot, (chatbot) => chatbot.user)
  chatbots: Chatbot[];
}