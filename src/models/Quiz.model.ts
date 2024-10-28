import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { Question } from "./Questions.model";
import { Book } from "./Books.model";
import { User } from "./User.model";
import { QuestionType, QuizLevel } from "../utils/validators/QuizValidator";

@Entity()
export class Quiz extends BaseModel {
  @Column()
  name: string;

  @Column()
  questionsType: QuestionType;

  @Column({ type: "enum", enum: QuizLevel })
  quizLevel: QuizLevel;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  questions: Question[];

  @ManyToOne(() => User)
  user: User;

  // @ManyToMany(() => Book)
  // @JoinTable({
  //   name: "QuizBooks",
  //   inverseJoinColumn: {
  //     name: "bookId",
  //     referencedColumnName: "id",
  //   },
  //   joinColumn: {
  //     name: "quizId",
  //     referencedColumnName: "id",
  //   },
  // })
  // books: Book[];

  static getUserQuizById(userId: string, quizId: string) {
    return this.findOne({
      where: {
        id: quizId,
        user: { id: userId },
      },
      relations: {
        questions: {
          answers: true,
        },
      },
    });
  }
}
