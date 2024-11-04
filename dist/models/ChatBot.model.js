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
var Chatbot_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatbot = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const ChatBotMessages_model_1 = require("./ChatBotMessages.model");
const Books_model_1 = require("./Books.model");
const User_model_1 = require("./User.model");
let Chatbot = Chatbot_1 = class Chatbot extends BaseModel_1.BaseModel {
    static getUserChatbotById(userId, chatbotId) {
        return this.findOne({
            where: {
                id: chatbotId,
                user: { id: userId },
            },
            relations: {
                books: true,
                messages: true,
            },
        });
    }
    static getChatbotQuerable({ userId, name, bookId, categoryId, fromDate, toDate, }) {
        let querable = Chatbot_1.getRepository()
            .createQueryBuilder("chatbot")
            .leftJoin("chatbot.user", "user")
            .leftJoinAndSelect("chatbot.books", "book")
            .leftJoinAndSelect("book.category", "category")
            .where("user.id = :userId", { userId });
        if (name) {
            querable = querable.andWhere("LOWER(chatbot.name) LIKE :name", {
                name: `%${name.toLowerCase()}%`,
            });
        }
        if (bookId) {
            querable = querable.andWhere("book.id = :bookId", { bookId });
        }
        if (categoryId) {
            querable = querable.andWhere("category.id = :categoryId", { categoryId });
        }
        if (fromDate && toDate) {
            querable = querable.andWhere("DATE(chatbot.createdAt) BETWEEN :fromDate AND :toDate", {
                fromDate,
                toDate,
            });
        }
        else {
            if (fromDate) {
                querable = querable.andWhere("DATE(chatbot.createdAt) >= :fromDate", {
                    fromDate,
                });
            }
            if (toDate) {
                querable = querable.andWhere("DATE(chatbot.createdAt) <= :toDate", {
                    toDate,
                });
            }
        }
        return querable.orderBy("chatbot.createdAt", "DESC");
    }
};
exports.Chatbot = Chatbot;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Chatbot.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChatBotMessages_model_1.ChatbotMessages, (message) => message.chatbot),
    __metadata("design:type", Array)
], Chatbot.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, (user) => user.chatbots),
    __metadata("design:type", User_model_1.User)
], Chatbot.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Books_model_1.Book),
    (0, typeorm_1.JoinTable)({
        name: "ChatbotsBooks",
        inverseJoinColumn: {
            name: "chatbotId",
            referencedColumnName: "id",
        },
        joinColumn: {
            name: "bookId",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Chatbot.prototype, "books", void 0);
exports.Chatbot = Chatbot = Chatbot_1 = __decorate([
    (0, typeorm_1.Entity)()
], Chatbot);
//# sourceMappingURL=ChatBot.model.js.map