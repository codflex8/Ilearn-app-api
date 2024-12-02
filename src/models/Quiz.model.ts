import {
  Between,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { Question } from "./Questions.model";
import { User } from "./User.model";
import { QuestionType, QuizLevel } from "../utils/validators/QuizValidator";
import { Book } from "./Books.model";

@Entity()
export class Quiz extends BaseModel {
  @Column()
  name: string;

  @Column({ type: "int", nullable: true })
  mark: number;

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

  @ManyToMany(() => Book)
  @JoinTable({
    name: "QuizBooks",
    inverseJoinColumn: {
      name: "bookId",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "quizId",
      referencedColumnName: "id",
    },
  })
  books: Book[];

  static getUserQuizById(userId: string, quizId: string) {
    return this.createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.questions", "question")
      .leftJoinAndSelect("question.answers", "answer")
      .leftJoinAndSelect("question.bookmark", "bookmark")
      .leftJoinAndSelect("quiz.books", "book")
      .where("quiz.id = :quizId", { quizId })
      .andWhere("quiz.userId = :userId", { userId })
      .orderBy("answer.createdAt", "ASC")
      .getOne();
  }

  static getQuizQuerable({
    userId,
    name,
    bookId,
    categoryId,
    fromDate,
    toDate,
  }: {
    userId: string;
    name?: string;
    bookId?: string;
    categoryId?: string;
    fromDate?: Date | string;
    toDate?: Date | string;
  }) {
    let querable = this.getRepository()
      .createQueryBuilder("quiz")
      .leftJoin("quiz.user", "user")
      .leftJoinAndSelect("quiz.books", "book")
      .leftJoinAndSelect("book.category", "category")
      .where("user.id = :userId", { userId });

    if (name) {
      querable = querable.andWhere("LOWER(quiz.name) LIKE :name", {
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
        "DATE(quiz.createdAt) BETWEEN :fromDate AND :toDate",
        {
          fromDate,
          toDate,
        }
      );
    } else {
      if (fromDate) {
        querable = querable.andWhere("DATE(quiz.createdAt) >= :fromDate", {
          fromDate,
        });
      }

      if (toDate) {
        querable = querable.andWhere("DATE(quiz.createdAt) <= :toDate", {
          toDate,
        });
      }
    }

    return querable.orderBy("quiz.createdAt", "DESC");
  }

  static async getQuizesPercentage({ userId, startDate, endDate, examsGoal }) {
    const fullmarkQuizesCount = await this.getRepository()
      .createQueryBuilder("quiz")
      .leftJoin("quiz.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("quiz.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("COUNT(DISTINCT question.id)")
          .from("quiz", "subQuiz")
          .leftJoin("subQuiz.questions", "question")
          .where("subQuiz.id = quiz.id")
          .getQuery();
        return `quiz.mark >= (${subQuery})`;
      })
      .getCount();
    return {
      examsGoal,
      examsCount: fullmarkQuizesCount,
      percentage: (fullmarkQuizesCount / examsGoal) * 100,
    };
  }
}
