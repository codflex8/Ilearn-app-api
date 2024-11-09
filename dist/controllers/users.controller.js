"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = require("../models/User.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const typeorm_1 = require("typeorm");
const GenericResponse_1 = require("../utils/GenericResponse");
exports.getUsers = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { page, pageSize, username } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let condition = {};
    if (username) {
        condition = Object.assign(Object.assign({}, condition), { username: (0, typeorm_1.ILike)(`%${username}%`) });
    }
    const [users, count] = await User_model_1.User.findAndCount({
        where: condition,
        select: {
            id: true,
            username: true,
            phoneNumber: true,
        },
        take,
        skip,
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, users));
});
//# sourceMappingURL=users.controller.js.map