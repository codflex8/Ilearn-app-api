"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Categories_model_1 = require("./Categories.model");
const Books_model_1 = require("./Books.model");
const AuthValidator_1 = require("../utils/validators/AuthValidator");
const BaseModel_1 = require("./BaseModel");
const ChatBot_model_1 = require("./ChatBot.model");
const Quiz_model_1 = require("./Quiz.model");
const Bookmarks_model_1 = require("./Bookmarks.model");
const GroupsChatUsers_model_1 = require("./GroupsChatUsers.model");
const getServerIpAddress_1 = require("../utils/getServerIpAddress");
const Notification_model_1 = require("./Notification.model");
let User = class User extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.fullImageUrl = null;
    }
    setFullImageUrl() {
        if (this.imageUrl) {
            !this.facebookId && !this.googleId && !this.twitterId
                ? (this.fullImageUrl = (0, getServerIpAddress_1.getServerIPAddress)() + this.imageUrl)
                : (this.fullImageUrl = this.imageUrl);
        }
    }
    // @ManyToMany(() => GroupsChat, (group) => group.users)
    // @JoinTable({ name: "groups_chat_users" })
    // groupsChat: GroupsChat[];
    static isEmailExist(email) {
        return this.exists({
            where: {
                email,
            },
        });
    }
    static getPublicUserDataByEmail(query) {
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
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "twitterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", nullable: true, enum: AuthValidator_1.GenderEnum }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "passwordChangedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "passwordResetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "passwordResetVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 3 }),
    __metadata("design:type", Number)
], User.prototype, "booksGoal", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4 }),
    __metadata("design:type", Number)
], User.prototype, "examsGoal", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 10 }),
    __metadata("design:type", Number)
], User.prototype, "intensePoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-array" }),
    __metadata("design:type", Array)
], User.prototype, "fcms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_model_1.Notification, (not) => not.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Notification_model_1.Notification)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Categories_model_1.Category, (category) => category.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Books_model_1.Book, (book) => book.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "books", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Quiz_model_1.Quiz, (quiz) => quiz.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "quizes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChatBot_model_1.Chatbot, (chatbot) => chatbot.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "chatbots", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Bookmarks_model_1.Bookmark, (bookmark) => bookmark.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GroupsChatUsers_model_1.GroupsChatUsers, (groupsChatUsers) => groupsChatUsers.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "userGroupsChats", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "setFullImageUrl", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=User.model.js.map