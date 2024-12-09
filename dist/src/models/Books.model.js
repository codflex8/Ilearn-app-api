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
var Book_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const typeorm_1 = require("typeorm");
const Categories_model_1 = require("./Categories.model");
const User_model_1 = require("./User.model");
const BaseModel_1 = require("./BaseModel");
const ChatBot_model_1 = require("./ChatBot.model");
const Quiz_model_1 = require("./Quiz.model");
const getServerIpAddress_1 = require("../utils/getServerIpAddress");
let Book = Book_1 = class Book extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.fullImageUrl = null;
    }
    setFullImageUrl() {
        if (this.imageUrl) {
            this.fullImageUrl = (0, getServerIpAddress_1.getServerIPAddress)() + this.imageUrl;
        }
    }
    chekBookImage() {
        if (!this.imageUrl) {
            this.fullImageUrl = (0, getServerIpAddress_1.getServerIPAddress)() + "/public/default/book.jpg";
        }
    }
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
    static async countBooksInDate({ userId, startDate, endDate }) {
        const weekBooksCount = await Book_1.count({
            where: {
                createdAt: (0, typeorm_1.Between)(startDate, endDate),
                user: {
                    id: userId,
                },
            },
        });
        return weekBooksCount;
    }
    static async getUserGoalPercentage({ userId, startDate, endDate, booksGoal, }) {
        const booksCount = await this.countBooksInDate({
            userId,
            startDate,
            endDate,
        });
        const weekPercentageData = {
            booksGoal: booksGoal,
            booksCount,
            percentage: (booksCount / booksGoal) * 100,
        };
        return weekPercentageData;
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
], Book.prototype, "s3Key", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "localPath", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Book.prototype, "setFullImageUrl", null);
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
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Book.prototype, "chekBookImage", null);
exports.Book = Book = Book_1 = __decorate([
    (0, typeorm_1.Entity)()
], Book);
//# sourceMappingURL=Books.model.js.map