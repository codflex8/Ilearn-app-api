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
    let query = {
        user: {
            id: user.id,
        },
    };
    if (type) {
        query = Object.assign(Object.assign({}, query), { type });
    }
    const [notifications, count] = await Notification_model_1.Notification.findAndCount({
        where: query,
        skip,
        take,
        order: {
            createdAt: "DESC",
        },
    });
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