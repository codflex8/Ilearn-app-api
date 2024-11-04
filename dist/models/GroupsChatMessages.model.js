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
exports.GroupsChatMessages = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const User_model_1 = require("./User.model");
const GroupsChat_model_1 = require("./GroupsChat.model");
let GroupsChatMessages = class GroupsChatMessages extends BaseModel_1.BaseModel {
};
exports.GroupsChatMessages = GroupsChatMessages;
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupsChat_model_1.GroupsChat),
    __metadata("design:type", GroupsChat_model_1.GroupsChat)
], GroupsChatMessages.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User),
    __metadata("design:type", User_model_1.User)
], GroupsChatMessages.prototype, "from", void 0);
exports.GroupsChatMessages = GroupsChatMessages = __decorate([
    (0, typeorm_1.Entity)()
], GroupsChatMessages);
//# sourceMappingURL=GroupsChatMessages.model.js.map