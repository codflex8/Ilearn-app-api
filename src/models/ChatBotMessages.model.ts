import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Chatbot } from "./ChatBot.model";
import { MessageFrom } from "../utils/validators/ChatbotValidator";

@Entity()
export class ChatbotMessages extends BaseModel {
  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  recordUrl: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: "enum", enum: MessageFrom })
  from: MessageFrom;

  @ManyToOne(() => Chatbot)
  chatbot: Chatbot;
}
