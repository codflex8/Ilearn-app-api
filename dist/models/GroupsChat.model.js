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
exports.GroupsChat = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const GroupsChatMessages_model_1 = require("./GroupsChatMessages.model");
const User_model_1 = require("./User.model");
const GroupsChatUsers_model_1 = require("./GroupsChatUsers.model");
let GroupsChat = class GroupsChat extends BaseModel_1.BaseModel {
    static getUserGroupChatById(userId, id) {
        return this.getRepository()
            .createQueryBuilder("chat")
            .leftJoinAndSelect("chat.users", "users")
            .leftJoinAndSelect("chat.userGroupsChats", "userGroupsChats")
            .where("chat.id = :id", { id })
            .andWhere("userGroupsChats.userId = :userId", { userId })
            .select("chat")
            .addSelect("userGroupsChats")
            .addSelect([
            "users.id",
            "users.email",
            "users.phoneNumber",
            "users.username",
            "users.gender",
            "users.imageUrl",
            "users.gender",
            "users.birthDate",
        ])
            .getOne();
    }
};
exports.GroupsChat = GroupsChat;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GroupsChat.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChat.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChat.prototype, "backgroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChat.prototype, "backgroundCoverUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GroupsChatMessages_model_1.GroupsChatMessages, (chat) => chat.group),
    __metadata("design:type", Array)
], GroupsChat.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GroupsChatUsers_model_1.GroupsChatUsers, (groupsChatUsers) => groupsChatUsers.groupChat),
    __metadata("design:type", Array)
], GroupsChat.prototype, "userGroupsChats", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_model_1.User),
    (0, typeorm_1.JoinTable)({
        name: "GroupsChatUsers",
        inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id",
        },
        joinColumn: {
            name: "chatId",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], GroupsChat.prototype, "users", void 0);
exports.GroupsChat = GroupsChat = __decorate([
    (0, typeorm_1.Entity)()
], GroupsChat);
//# sourceMappingURL=GroupsChat.model.js.map