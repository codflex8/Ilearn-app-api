"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserStatus = exports.toggleUserStatus = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getPaginationData_1 = require("../../utils/getPaginationData");
const GenericResponse_1 = require("../../utils/GenericResponse");
const User_model_1 = require("../../models/User.model");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const AuthValidator_1 = require("../../utils/validators/AuthValidator");
exports.getUsers = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { page, pageSize, username, status } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const queryBuilder = User_model_1.User.createQueryBuilder("user");
    if (username) {
        queryBuilder.andWhere("LOWER(user.username) LIKE :username", {
            username: `%${username.toString().toLowerCase()}%`,
        });
    }
    if (status) {
        queryBuilder.andWhere("user.status = :status", {
            status,
        });
    }
    queryBuilder.skip(skip).take(take).orderBy("user.createdAt", "DESC");
    const [users, count] = await queryBuilder.getManyAndCount();
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, users));
});
exports.toggleUserStatus = (0, express_async_handler_1.default)(async (req, res, next) => {
    const id = req.params.id;
    const user = await User_model_1.User.findOneBy({ id });
    if (!user)
        throw new ApiError_1.default(req.t("not-found"), 400);
    user.status =
        user.status === AuthValidator_1.UserStatus.active
            ? AuthValidator_1.UserStatus.unactive
            : AuthValidator_1.UserStatus.active;
    await user.save();
    res.status(200).json({ message: "toggle status success" });
});
exports.removeUserStatus = (0, express_async_handler_1.default)(async (req, res, next) => {
    const id = req.params.id;
    const user = await User_model_1.User.findOneBy({ id });
    if (!user)
        throw new ApiError_1.default(req.t("not-found"), 400);
    await user.remove();
    res.status(200).json({ message: "toggle status success" });
});
//# sourceMappingURL=users.controller.js.map