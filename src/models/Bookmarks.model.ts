import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User.model";
import { ChatbotMessages } from "./ChatBotMessages.model";
import { Question } from "./Questions.model";

@Entity()
export class Bookmark extends BaseModel {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => ChatbotMessages)
  @JoinColumn()
  chatbotMessage: ChatbotMessages;

  @OneToOne(() => Question)
  @JoinColumn()
  question: Question;
}
