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
exports.Book = void 0;
const typeorm_1 = require("typeorm");
const Categories_model_1 = require("./Categories.model");
const User_model_1 = require("./User.model");
const BaseModel_1 = require("./BaseModel");
const ChatBot_model_1 = require("./ChatBot.model");
const Quiz_model_1 = require("./Quiz.model");
let Book = class Book extends BaseModel_1.BaseModel {
    static getUserBookById(userId, bookId) {
        return this.findOne({
            where: {
                id: bookId,
                user: { id: userId },
            },
            relations: {
                category: true,
            },
        });
    }
};
exports.Book = Book;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Categories_model_1.Category),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", Categories_model_1.Category)
], Book.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, (user) => user.books),
    (0, typeorm_1.JoinColumn)({
        name: "userId",
    }),
    __metadata("design:type", User_model_1.User)
], Book.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ChatBot_model_1.Chatbot),
    (0, typeorm_1.JoinTable)({
        name: "ChatbotsBooks",
        joinColumn: {
            name: "chatbotId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "bookId",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Book.prototype, "chatbots", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Quiz_model_1.Quiz),
    (0, typeorm_1.JoinTable)({
        name: "QuizBooks",
        joinColumn: {
            name: "bookId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "quizId",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Book.prototype, "quizes", void 0);
exports.Book = Book = __decorate([
    (0, typeorm_1.Entity)()
], Book);
//# sourceMappingURL=Books.model.js.map