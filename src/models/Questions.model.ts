import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  VirtualColumn,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { Quiz } from "./Quiz.model";
import { Answer } from "./Answers.model";
import { QuestionType } from "../utils/validators/QuizValidator";
import { Bookmark } from "./Bookmarks.model";

@Entity()
export class Question extends BaseModel {
  @Column()
  question: string;

  @Column({ type: "enum", enum: QuestionType })
  type: QuestionType;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @Column({ type: "int", nullable: true })
  userAnswerIndex: number;

  @Column({ type: "int", nullable: true })
  aiAnswerIndex: number;

  @Column({ type: "int", nullable: true })
  correctAnswerIndex: number;

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  answers: Answer[];

  @OneToOne(() => Bookmark, (bookmark) => bookmark.question, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  // @JoinColumn()
  bookmark: Bookmark;

  isBookmarked: boolean;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  updateCoverPhotoLink() {
    this.isBookmarked = !!this.bookmark;
  }
}
