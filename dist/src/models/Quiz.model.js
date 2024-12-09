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
exports.Quiz = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Questions_model_1 = require("./Questions.model");
const User_model_1 = require("./User.model");
const QuizValidator_1 = require("../utils/validators/QuizValidator");
const Books_model_1 = require("./Books.model");
let Quiz = class Quiz extends BaseModel_1.BaseModel {
    static getUserQuizById(userId, quizId) {
        return this.createQueryBuilder("quiz")
            .leftJoinAndSelect("quiz.questions", "question")
            .leftJoinAndSelect("question.answers", "answer")
            .leftJoinAndSelect("question.bookmark", "bookmark")
            .leftJoinAndSelect("quiz.books", "book")
            .where("quiz.id = :quizId", { quizId })
            .andWhere("quiz.userId = :userId", { userId })
            .orderBy("answer.createdAt", "ASC")
            .getOne();
    }
    static getQuizQuerable({ userId, name, bookId, categoryId, fromDate, toDate, }) {
        let querable = this.getRepository()
            .createQueryBuilder("quiz")
            .leftJoin("quiz.user", "user")
            .leftJoinAndSelect("quiz.books", "book")
            .leftJoinAndSelect("book.category", "category")
            .where("user.id = :userId", { userId });
        if (name) {
            querable = querable.andWhere("LOWER(quiz.name) LIKE :name", {
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
            querable = querable.andWhere("DATE(quiz.createdAt) BETWEEN :fromDate AND :toDate", {
                fromDate,
                toDate,
            });
        }
        else {
            if (fromDate) {
                querable = querable.andWhere("DATE(quiz.createdAt) >= :fromDate", {
                    fromDate,
                });
            }
            if (toDate) {
                querable = querable.andWhere("DATE(quiz.createdAt) <= :toDate", {
                    toDate,
                });
            }
        }
        return querable.orderBy("quiz.createdAt", "DESC");
    }
    static async getQuizesPercentage({ userId, startDate, endDate, examsGoal }) {
        const fullmarkQuizesCount = await this.getRepository()
            .createQueryBuilder("quiz")
            .leftJoin("quiz.user", "user")
            .where("user.id = :userId", { userId })
            .andWhere("quiz.createdAt BETWEEN :startDate AND :endDate", {
            startDate,
            endDate,
        })
            .andWhere((qb) => {
            const subQuery = qb
                .subQuery()
                .select("COUNT(DISTINCT question.id)")
                .from("quiz", "subQuiz")
                .leftJoin("subQuiz.questions", "question")
                .where("subQuiz.id = quiz.id")
                .getQuery();
            return `quiz.mark >= (${subQuery})`;
        })
            .getCount();
        return {
            examsGoal,
            examsCount: fullmarkQuizesCount,
            percentage: (fullmarkQuizesCount / examsGoal) * 100,
        };
    }
};
exports.Quiz = Quiz;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quiz.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Quiz.prototype, "mark", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quiz.prototype, "questionsType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: QuizValidator_1.QuizLevel }),
    __metadata("design:type", String)
], Quiz.prototype, "quizLevel", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Questions_model_1.Question, (question) => question.quiz, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User),
    __metadata("design:type", User_model_1.User)
], Quiz.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Books_model_1.Book),
    (0, typeorm_1.JoinTable)({
        name: "QuizBooks",
        inverseJoinColumn: {
            name: "bookId",
            referencedColumnName: "id",
        },
        joinColumn: {
            name: "quizId",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "books", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typeorm_1.Entity)()
], Quiz);
//# sourceMappingURL=Quiz.model.js.map