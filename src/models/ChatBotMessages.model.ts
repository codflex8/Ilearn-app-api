import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import { Chatbot } from "./ChatBot.model";
import { MessageFrom } from "../utils/validators/ChatbotValidator";
import { Bookmark } from "./Bookmarks.model";
import { getServerIPAddress } from "../utils/getServerIpAddress";

@Entity()
export class ChatbotMessages extends BaseModel {
  @Column({ nullable: true, type: "longtext" })
  message: string;

  @Column({ nullable: true })
  recordUrl: string;

  @Column({ nullable: true })
  imageUrl: string;
  fullImageUrl: string = null;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setFullImageUrl() {
    if (this.imageUrl) {
      this.fullImageUrl = getServerIPAddress() + this.imageUrl;
    }
  }
  @Column({ type: "enum", enum: MessageFrom })
  from: MessageFrom;

  @ManyToOne(() => Chatbot)
  chatbot: Chatbot;

  @OneToOne(() => Bookmark, (bookmark) => bookmark.chatbotMessage)
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
