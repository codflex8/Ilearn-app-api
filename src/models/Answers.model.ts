import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Question } from "./Questions.model";

@Entity()
export class Answer extends BaseModel {
  @Column({ type: "longtext" })
  answer: string;

  // @Column({ type: "boolean", default: false })
  // isCorrectAnswer: boolean;

  // @Column({ type: "boolean", default: false })
  // aiAnswer: boolean;

  // @Column({ type: "boolean", default: false })
  // isUserAnswer: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
