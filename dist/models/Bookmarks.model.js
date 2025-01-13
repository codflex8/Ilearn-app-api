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
exports.Bookmark = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const User_model_1 = require("./User.model");
const ChatBotMessages_model_1 = require("./ChatBotMessages.model");
const Questions_model_1 = require("./Questions.model");
let Bookmark = class Bookmark extends BaseModel_1.BaseModel {
};
exports.Bookmark = Bookmark;
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_model_1.User)
], Bookmark.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ChatBotMessages_model_1.ChatbotMessages, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ChatBotMessages_model_1.ChatbotMessages)
], Bookmark.prototype, "chatbotMessage", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Questions_model_1.Question, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Questions_model_1.Question)
], Bookmark.prototype, "question", void 0);
exports.Bookmark = Bookmark = __decorate([
    (0, typeorm_1.Entity)()
], Bookmark);
//# sourceMappingURL=Bookmarks.model.js.map