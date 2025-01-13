"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = exports.addAdmin = exports.defaultAdmin = exports.signin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = require("../../models/User.model");
const AuthValidator_1 = require("../../utils/validators/AuthValidator");
const bcrypt = __importStar(require("bcryptjs"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createToken_1 = require("../../utils/createToken");
const bcryptPassword_1 = __importDefault(require("../../utils/bcryptPassword"));
const getUserFromToken_1 = require("../../utils/getUserFromToken");
exports.signin = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOneBy({
        email: req.body.email,
        role: AuthValidator_1.UsersRoles.admin,
    });
    if (!user ||
        !(await bcrypt.compare(req.body.password, user.dashboardPassword))) {
        return next(new ApiError_1.default(req.t("IncorrectEmailPasswod"), 400));
    }
    const token = await (0, createToken_1.createToken)(user.id);
    res.status(200).json({ token, user });
});
exports.defaultAdmin = (0, express_async_handler_1.default)(async (req, res, next) => {
    const isAdminExist = await User_model_1.User.findOneBy({
        role: AuthValidator_1.UsersRoles.admin,
    });
    if (isAdminExist) {
        throw new ApiError_1.default("admin exist", 400);
    }
    const cryptedPassword = await (0, bcryptPassword_1.default)("admin.***");
    const addAdmin = User_model_1.User.create({
        email: "admin@admin.com",
        dashboardPassword: cryptedPassword,
        username: "admin",
        role: AuthValidator_1.UsersRoles.admin,
    });
    await addAdmin.save();
    res.status(200).json({ message: "success" });
});
exports.addAdmin = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password, username } = req.body;
    const isUserExist = await User_model_1.User.findOne({ where: { email } });
    if (isUserExist && isUserExist.role === AuthValidator_1.UsersRoles.admin) {
        throw new ApiError_1.default(req.t("this_email_signed_up_already"), 409);
    }
    const cryptedPassword = await (0, bcryptPassword_1.default)(password);
    if (isUserExist) {
        isUserExist.role = AuthValidator_1.UsersRoles.admin;
        isUserExist.dashboardPassword = cryptedPassword;
        await isUserExist.save();
        res.status(200).json({ message: req.t("sign_up_success") });
        return;
    }
    const newUser = await User_model_1.User.create({
        email,
        dashboardPassword: cryptedPassword,
        username,
    });
    await newUser.save();
    res.status(200).json({ message: req.t("sign_up_success") });
});
exports.protectAdmin = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    console.log("tokennnn", token);
    if (!token) {
        return next(new ApiError_1.default(req.t("unauthorized"), 401));
    }
    // 2) Verify token (no change happens, expired token)
    const { currentUser, decoded } = await (0, getUserFromToken_1.getUserFromToken)(token);
    console.log("ddddddd", currentUser);
    if (!currentUser || currentUser.role !== AuthValidator_1.UsersRoles.admin) {
        return next(new ApiError_1.default(req.t("unauthorized"), 401));
    }
    req.user = currentUser;
    next();
});
//# sourceMappingURL=authenticate.controller.js.map