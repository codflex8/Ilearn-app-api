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

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  answers: Answer[];

  @OneToOne(() => Bookmark, (bookmark) => bookmark.question)
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
