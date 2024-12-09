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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const User_model_1 = require("./User.model");
const GroupsChat_model_1 = require("./GroupsChat.model");
let Notification = class Notification extends BaseModel_1.BaseModel {
    static async createNewNotification({ message, user, group, }) {
        const newNotification = await this.create({
            message,
            user,
            group,
        });
        newNotification.save();
        return newNotification;
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User),
    __metadata("design:type", User_model_1.User)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_model_1.User),
    (0, typeorm_1.JoinColumn)({ name: "from_user_id" }),
    __metadata("design:type", User_model_1.User)
], Notification.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupsChat_model_1.GroupsChat),
    __metadata("design:type", GroupsChat_model_1.GroupsChat)
], Notification.prototype, "group", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
//# sourceMappingURL=Notification.model.js.map