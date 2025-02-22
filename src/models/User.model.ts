import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  FindOptionsWhere,
  OneToMany,
} from "typeorm";
import { Category } from "./Categories.model";
import { Book } from "./Books.model";
import {
  GenderEnum,
  LanguageEnum,
  UsersRoles,
  UserStatus,
} from "../utils/validators/AuthValidator";
import { BaseModel } from "./BaseModel";
import { Chatbot } from "./ChatBot.model";
import { Quiz } from "./Quiz.model";
import { Bookmark } from "./Bookmarks.model";
import { GroupsChat } from "./GroupsChat.model";
import { GroupsChatUsers } from "./GroupsChatUsers.model";
import { getServerIPAddress } from "../utils/getServerIpAddress";
import { Notification } from "./Notification.model";
import { ShareApp } from "./ShareApp.model";

@Entity()
export class User extends BaseModel {
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  dashboardPassword: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  twitterId: string;

  @Column({ type: "datetime", nullable: true })
  birthDate: Date;

  @Column({ type: "enum", nullable: true, enum: GenderEnum })
  gender: GenderEnum;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "boolean", default: false })
  verifyEmail: Boolean;

  @Column({ type: "int", nullable: true })
  verifyCode: number;

  @Column({ type: "datetime", nullable: true })
  passwordChangedAt: Date;

  @Column({ type: "int", nullable: true })
  passwordResetCode: number;

  @Column({ type: "datetime", nullable: true })
  passwordResetExpires: Date;

  @Column({ type: "boolean", default: false })
  passwordResetVerified: Boolean;

  @Column({ default: 3 })
  booksGoal: number;

  @Column({ default: 4 })
  examsGoal: number;

  @Column({ default: 10 })
  intensePoints: number;

  // firebase tokens for notifcations
  @Column({ nullable: true })
  fcm: string;

  @Column({ type: "enum", nullable: true, enum: LanguageEnum })
  language: LanguageEnum;

  @Column({ type: "enum", enum: UsersRoles, default: UsersRoles.user })
  role: UsersRoles;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.active })
  status: UserStatus;

  @OneToMany(() => Notification, (not) => not.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  notifications: Notification;

  @OneToMany(() => Category, (category) => category.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  categories: Category[];

  @OneToMany(() => ShareApp, (shareApp) => shareApp.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  shareGroups: ShareApp[];

  @OneToMany(() => Book, (book) => book.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  books: Book[];

  @OneToMany(() => Quiz, (quiz) => quiz.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  quizes: Quiz[];

  @OneToMany(() => Chatbot, (chatbot) => chatbot.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  chatbots: Chatbot[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  bookmarks: Bookmark[];

  @OneToMany(() => GroupsChatUsers, (groupsChatUsers) => groupsChatUsers.user, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  userGroupsChats: GroupsChatUsers[];

  fullImageUrl: string = null;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  setFullImageUrl() {
    if (this.imageUrl) {
      !this.imageUrl.startsWith("http")
        ? (this.fullImageUrl = getServerIPAddress() + this.imageUrl)
        : (this.fullImageUrl = this.imageUrl);
    }
  }

  static isEmailExist(email: string) {
    return this.exists({
      where: {
        email,
      },
    });
  }

  static getPublicUserDataByEmail(query: FindOptionsWhere<User>) {
    return this.findOne({
      where: query,
      select: [
        "username",
        "email",
        "imageUrl",
        "gender",
        "birthDate",
        "gender",
        "id",
        "phoneNumber",
        "booksGoal",
        "examsGoal",
        "intensePoints",
      ],
    });
  }
}
