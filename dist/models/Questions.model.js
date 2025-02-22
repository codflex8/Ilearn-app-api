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
exports.Question = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Quiz_model_1 = require("./Quiz.model");
const Answers_model_1 = require("./Answers.model");
const QuizValidator_1 = require("../utils/validators/QuizValidator");
const Bookmarks_model_1 = require("./Bookmarks.model");
let Question = class Question extends BaseModel_1.BaseModel {
    updateCoverPhotoLink() {
        this.isBookmarked = !!this.bookmark;
    }
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.Column)({ type: "longtext" }),
    __metadata("design:type", String)
], Question.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Question.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: QuizValidator_1.QuestionType }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quiz_model_1.Quiz, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Quiz_model_1.Quiz)
], Question.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Question.prototype, "userAnswerIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longtext" }),
    __metadata("design:type", String)
], Question.prototype, "aiAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longtext", nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "userAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Question.prototype, "correctAnswerIndex", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Answers_model_1.Answer, (answer) => answer.question, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Question.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Bookmarks_model_1.Bookmark, (bookmark) => bookmark.question, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // @JoinColumn()
    ,
    __metadata("design:type", Bookmarks_model_1.Bookmark)
], Question.prototype, "bookmark", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Question.prototype, "updateCoverPhotoLink", null);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)()
], Question);
//# sourceMappingURL=Questions.model.js.map