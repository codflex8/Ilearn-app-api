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
exports.GroupsChatUsers = void 0;
const typeorm_1 = require("typeorm");
const User_model_1 = require("./User.model");
const GroupsChat_model_1 = require("./GroupsChat.model");
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const BaseModel_1 = require("./BaseModel");
let GroupsChatUsers = class GroupsChatUsers extends BaseModel_1.BaseModel {
};
exports.GroupsChatUsers = GroupsChatUsers;
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], GroupsChatUsers.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], GroupsChatUsers.prototype, "chatId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], GroupsChatUsers.prototype, "muteNotification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: GroupsChatValidator_1.GroupChatRoles, nullable: true }),
    __metadata("design:type", String)
], GroupsChatUsers.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, (user) => user.userGroupsChats),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_model_1.User)
], GroupsChatUsers.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupsChat_model_1.GroupsChat, (chat) => chat.userGroupsChats),
    (0, typeorm_1.JoinColumn)({ name: "chatId" }),
    __metadata("design:type", GroupsChat_model_1.GroupsChat)
], GroupsChatUsers.prototype, "groupChat", void 0);
exports.GroupsChatUsers = GroupsChatUsers = __decorate([
    (0, typeorm_1.Entity)("GroupsChatUsers")
], GroupsChatUsers);
//# sourceMappingURL=GroupsChatUsers.model.js.map