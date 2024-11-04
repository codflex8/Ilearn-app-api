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
exports.ChatbotMessages = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const ChatBot_model_1 = require("./ChatBot.model");
const ChatbotValidator_1 = require("../utils/validators/ChatbotValidator");
const Bookmarks_model_1 = require("./Bookmarks.model");
let ChatbotMessages = class ChatbotMessages extends BaseModel_1.BaseModel {
};
exports.ChatbotMessages = ChatbotMessages;
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatbotMessages.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatbotMessages.prototype, "recordUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatbotMessages.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ChatbotValidator_1.MessageFrom }),
    __metadata("design:type", String)
], ChatbotMessages.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ChatBot_model_1.Chatbot),
    __metadata("design:type", ChatBot_model_1.Chatbot)
], ChatbotMessages.prototype, "chatbot", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Bookmarks_model_1.Bookmark, (bookmark) => bookmark.chatbotMessage)
    // @JoinColumn()
    ,
    __metadata("design:type", Bookmarks_model_1.Bookmark)
], ChatbotMessages.prototype, "bookmark", void 0);
exports.ChatbotMessages = ChatbotMessages = __decorate([
    (0, typeorm_1.Entity)()
], ChatbotMessages);
//# sourceMappingURL=ChatBotMessages.model.js.map