"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.addReport = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const report_model_1 = require("../../models/report.model");
const GroupsChat_model_1 = require("../../models/GroupsChat.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
exports.addReport = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const group = await GroupsChat_model_1.GroupsChat.findOne({
        where: {
            id,
        },
    });
    if (!group) {
        throw new ApiError_1.default(req.t("group_chat_not_found"), 400);
    }
    const report = report_model_1.Report.create({
        user,
        group,
    });
    await report.save();
    console.log(report);
    res.json({ message: req.t("success") });
});
exports.getReports = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const reports = await report_model_1.Report.find({
        where: {
            user: {
                id: user.id,
            },
            group: {
                id,
            },
        },
        relations: ["group", "user"],
    });
    res.json({ reports });
});
//# sourceMappingURL=report.controller.js.map