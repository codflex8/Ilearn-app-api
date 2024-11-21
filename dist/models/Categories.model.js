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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const Books_model_1 = require("./Books.model");
const User_model_1 = require("./User.model");
const BaseModel_1 = require("./BaseModel");
let Category = class Category extends BaseModel_1.BaseModel {
    chekCategoryImage() {
        if (!this.imageUrl) {
            this.imageUrl = "/public/default/category.jpg";
        }
    }
    static getUserCategoryById(userId, categoryId) {
        return this.findOne({
            where: {
                id: categoryId,
                user: { id: userId },
            },
            relations: {
                books: true,
            },
        });
    }
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Books_model_1.Book, (book) => book.category, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Category.prototype, "books", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, (user) => user.categories),
    (0, typeorm_1.JoinColumn)({
        name: "userId",
    }),
    __metadata("design:type", User_model_1.User)
], Category.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Category.prototype, "chekCategoryImage", null);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)()
], Category);
//# sourceMappingURL=Categories.model.js.map