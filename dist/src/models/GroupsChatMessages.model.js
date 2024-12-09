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
var GroupsChatMessages_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsChatMessages = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const User_model_1 = require("./User.model");
const GroupsChat_model_1 = require("./GroupsChat.model");
const getServerIpAddress_1 = require("../utils/getServerIpAddress");
let GroupsChatMessages = GroupsChatMessages_1 = class GroupsChatMessages extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this.fullImageUrl = null;
    }
    setFullImageUrl() {
        if (this.imageUrl) {
            this.fullImageUrl = (0, getServerIpAddress_1.getServerIPAddress)() + this.imageUrl;
        }
    }
    // @AfterLoad()
    // @AfterInsert()
    // @AfterUpdate()
    // isMessageSeen() {
    //   this.seen = !!this.readbyIds?.find((id) => id === this.id);
    // }
    isSeenMessage(userId) {
        var _a;
        this.seen = !!((_a = this.readbyIds) === null || _a === void 0 ? void 0 : _a.find((id) => id === userId));
    }
    static countChatUreadMessages(chatId, userId) {
        return GroupsChatMessages_1.getRepository()
            .createQueryBuilder("message")
            .leftJoin("message.group", "group")
            .where("group.id = :groupId", { groupId: chatId })
            .andWhere(new typeorm_1.Brackets((qb) => {
            qb.where("message.readbyIds IS NULL") // Include messages with no readbyIds
                .orWhere(new typeorm_1.Brackets((innerQb) => {
                innerQb
                    .where("message.readbyIds NOT LIKE :middleUserId", {
                    middleUserId: `%,${userId},%`,
                })
                    .andWhere("message.readbyIds NOT LIKE :startUserId", {
                    startUserId: `${userId},%`,
                })
                    .andWhere("message.readbyIds NOT LIKE :endUserId", {
                    endUserId: `%,${userId}`,
                })
                    .andWhere("message.readbyIds != :exactUserId", {
                    exactUserId: userId,
                });
            }));
        }))
            .getCount();
    }
};
exports.GroupsChatMessages = GroupsChatMessages;
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "longtext" }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupsChatMessages.prototype, "setFullImageUrl", null);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "recordUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], GroupsChatMessages.prototype, "isLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GroupsChatMessages.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupsChat_model_1.GroupsChat),
    __metadata("design:type", GroupsChat_model_1.GroupsChat)
], GroupsChatMessages.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupsChat_model_1.GroupsChat),
    (0, typeorm_1.JoinColumn)({ name: "shared_group_id" }),
    __metadata("design:type", GroupsChat_model_1.GroupsChat)
], GroupsChatMessages.prototype, "sharedGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User, { onDelete: "SET NULL" }),
    __metadata("design:type", User_model_1.User)
], GroupsChatMessages.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-array", nullable: true }),
    __metadata("design:type", Array)
], GroupsChatMessages.prototype, "readbyIds", void 0);
exports.GroupsChatMessages = GroupsChatMessages = GroupsChatMessages_1 = __decorate([
    (0, typeorm_1.Entity)()
], GroupsChatMessages);
//# sourceMappingURL=GroupsChatMessages.model.js.map