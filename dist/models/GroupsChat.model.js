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
const GroupsChatUsers_model_1 = require("./GroupsChatUsers.model");
let GroupsChat = class GroupsChat extends BaseModel_1.BaseModel {
    isAcceptJoin(userId, filterUserGroups) {
        var _a, _b;
        if (this.userGroupsChats.length) {
            this.acceptJoin = filterUserGroups
                ? !!((_a = this.userGroupsChats.find((userGroup) => userGroup.user.id === userId)) === null || _a === void 0 ? void 0 : _a.acceptJoin)
                : (_b = this.userGroupsChats[0]) === null || _b === void 0 ? void 0 : _b.acceptJoin;
        }
    }
    static isGroupChatExist(id, userId) {
        return this.getRepository().exists({
            where: {
                id,
                userGroupsChats: {
                    user: {
                        id: userId,
                    },
                },
            },
        });
    }
    static getUserGroupChatById(userId, id) {
        return this.getRepository()
            .createQueryBuilder("chat")
            .leftJoinAndSelect("chat.userGroupsChats", "userGroupsChats")
            .leftJoinAndSelect("userGroupsChats.user", "user")
            .where("chat.id = :id", { id })
            .andWhere((qb) => {
            const subQuery = qb
                .subQuery()
                .select("ugc.groupChat.id")
                .from(GroupsChatUsers_model_1.GroupsChatUsers, "ugc")
                .where("ugc.user.id = :userId", { userId })
                .getQuery();
            return `chat.id IN ${subQuery}`;
        })
            .select("chat")
            .addSelect("userGroupsChats")
            .addSelect([
            "user.id",
            "user.email",
            "user.phoneNumber",
            "user.username",
            "user.gender",
            "user.imageUrl",
            "user.birthDate",
        ])
            .getOne();
    }
    static async getGroupChatWithMessagesData(chat, userId) {
        const messages = await GroupsChatMessages_model_1.GroupsChatMessages.find({
            where: {
                group: {
                    id: chat.id,
                },
            },
            order: {
                createdAt: "DESC",
            },
            take: 10,
        });
        const unreadMessagesCount = await GroupsChatMessages_model_1.GroupsChatMessages.countChatUreadMessages(chat.id, userId);
        chat.messages = messages.map((msg) => {
            msg.isSeenMessage(userId);
            return msg;
        });
        chat.unreadMessagesCount = unreadMessagesCount;
        return chat;
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
exports.GroupsChat = GroupsChat = __decorate([
    (0, typeorm_1.Entity)()
], GroupsChat);
//# sourceMappingURL=GroupsChat.model.js.map