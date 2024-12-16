"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getPaginationData_1 = require("../utils/getPaginationData");
const Notification_model_1 = require("../models/Notification.model");
const typeorm_1 = require("typeorm");
const GenericResponse_1 = require("../utils/GenericResponse");
const websocket_1 = __importDefault(require("../websocket/websocket"));
exports.getNotifications = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, type } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const querable = Notification_model_1.Notification.getRepository()
        .createQueryBuilder("notification")
        .leftJoinAndSelect("notification.user", "user")
        .leftJoinAndSelect("notification.group", "group")
        .leftJoinAndSelect("group.userGroupsChats", "userGroupsChats", "userGroupsChats.userId = :userId", { userId: user.id })
        .leftJoinAndSelect("notification.fromUser", "fromUser")
        .where("user.id = :userId", { userId: user.id });
    if (type) {
        querable.andWhere("notification.type");
    }
    const [notifications, count] = await querable
        .orderBy("user.createdAt", "DESC")
        .skip(skip)
        .take(take)
        .select("notification")
        .addSelect("user")
        .addSelect("group")
        .addSelect("userGroupsChats")
        .addSelect([
        "fromUser.id",
        "fromUser.username",
        "fromUser.email",
        "fromUser.imageUrl",
    ])
        .getManyAndCount();
    notifications.map((notif) => { var _a; return (_a = notif.group) === null || _a === void 0 ? void 0 : _a.isAcceptJoin(user.id, false); });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, notifications));
    const notificationsIds = notifications.map((notif) => notif.id);
    await Notification_model_1.Notification.update({
        id: (0, typeorm_1.In)(notificationsIds),
    }, {
        seen: true,
    });
    websocket_1.default.sendNotificationsCount(user.id);
});
//# sourceMappingURL=Notifications.controller.js.map