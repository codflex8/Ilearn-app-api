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
exports.resetPassword = exports.verifyPassResetCode = exports.forgotPassword = exports.protect = exports.signIn = exports.signup = void 0;
const User_model_1 = require("../models/User.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcrypt = __importStar(require("bcryptjs"));
const createToken_1 = __importDefault(require("../utils/createToken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const generateCode_1 = __importDefault(require("../utils/generateCode"));
const typeorm_1 = require("typeorm");
exports.signup = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { username, email, password, imageUrl } = req.body;
    const isUserExist = await User_model_1.User.findOne({
        where: {
            email: (0, typeorm_1.Equal)(req.body.email),
        },
    });
    if (isUserExist) {
        return next(new ApiError_1.default("email is used by other user", 409));
    }
    // 1- Create user
    const cryptedPassword = await (0, bcryptPassword_1.default)(password);
    const user = await User_model_1.User.create({
        username,
        email,
        password: cryptedPassword,
        imageUrl,
    });
    await user.save();
    delete user.password;
    delete user.passwordChangedAt;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    // 2- Generate token
    const token = (0, createToken_1.default)(user.id);
    res.status(201).json({ data: user, token });
});
exports.signIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOneBy({ email: (0, typeorm_1.Equal)(req.body.email) });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError_1.default("Incorrect email or password", 401));
    }
    const token = (0, createToken_1.default)(user.id);
    delete user.password;
    res.status(200).json({ user, token });
});
exports.protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError_1.default("You are not login, Please login to get access this route", 401));
    }
    // 2) Verify token (no change happens, expired token)
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    // 3) Check if user exists
    const currentUser = await User_model_1.User.findOne({
        where: { id: decoded.userId },
        select: [
            "id",
            "username",
            "email",
            "gender",
            "phoneNumber",
            "birthDate",
            "imageUrl",
        ],
    });
    if (!currentUser) {
        return next(new ApiError_1.default("The user that belong to this token does no longer exist", 401));
    }
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
        // Password changed after token created (Error)
        if (decoded.iat && passChangedTimestamp > decoded.iat) {
            return next(new ApiError_1.default("User recently changed his password. please login again..", 401));
        }
    }
    // ToDo: set user
    req.user = currentUser;
    next();
});
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1) Get user by email
    const user = await User_model_1.User.findOne({ where: { email: (0, typeorm_1.Equal)(req.body.email) } });
    if (!user) {
        return next(new ApiError_1.default(`There is no user with that email ${req.body.email}`, 404));
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = (0, generateCode_1.default)();
    // Save hashed password reset code into db
    user.passwordResetCode = resetCode;
    // Add expiration time for password reset code (1 min)
    const oneMinuteLater = new Date(Date.now() + 1 * 60 * 1000);
    user.passwordResetExpires = oneMinuteLater;
    user.passwordResetVerified = false;
    await user.save();
    // 3) Send the reset code via email
    const message = `Hi ${user.username},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await (0, sendEmail_1.default)({
            email: user.email,
            subject: "Your password reset code (valid for 10 min)",
            message,
        });
    }
    catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError_1.default("There is an error in sending email", 500));
    }
    res
        .status(200)
        .json({ status: "Success", message: "Reset code sent to email" });
});
exports.verifyPassResetCode = (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1) Get user based on reset code
    const user = await User_model_1.User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        return next(new ApiError_1.default("Reset code invalid or expired", 400));
    }
    const timeDiff = Date.now() - Number(user.passwordResetExpires);
    const oneMinutesInMilliesecond = 60000;
    if (timeDiff > oneMinutesInMilliesecond ||
        user.passwordResetCode != req.body.resetCode) {
        return next(new ApiError_1.default("Reset code invalid or expired", 400));
    }
    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({
        status: "Success",
    });
});
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1) Get user based on email
    const user = await User_model_1.User.findOne({ where: { email: (0, typeorm_1.Equal)(req.body.email) } });
    if (!user) {
        return next(new ApiError_1.default(`There is no user with email ${req.body.email}`, 404));
    }
    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError_1.default("Reset code not verified", 400));
    }
    const cryptedPassword = await (0, bcryptPassword_1.default)(req.body.password);
    user.password = cryptedPassword;
    user.passwordChangedAt = new Date();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;
    await user.save();
    // 3) if everything is ok, generate token
    const token = (0, createToken_1.default)(user.id);
    res.status(200).json({ token });
});
//# sourceMappingURL=authentication.controller.js.map