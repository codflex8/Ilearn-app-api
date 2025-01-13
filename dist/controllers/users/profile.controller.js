"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileData = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = require("../../models/User.model");
const typeorm_1 = require("typeorm");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
exports.updateProfileData = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOne({
        where: {
            id: req.user.id,
        },
    });
    const { phoneNumber, email, username, birthDate, gender, image, booksGoal, examsGoal, intensePoints, language, } = req.body;
    const isEmailExist = await User_model_1.User.findOne({
        where: {
            email: (0, typeorm_1.Equal)(email),
            id: (0, typeorm_1.Not)((0, typeorm_1.Equal)(user.id)),
        },
    });
    if (isEmailExist) {
        return next(new ApiError_1.default(req.t("email_is_used_by_other_user"), 409));
    }
    const isPhoneNumberExist = await User_model_1.User.findOne({
        where: {
            phoneNumber: (0, typeorm_1.Equal)(phoneNumber),
            id: (0, typeorm_1.Not)((0, typeorm_1.Equal)(user.id)),
        },
    });
    if (isPhoneNumberExist) {
        return next(new ApiError_1.default(req.t("phone_number_is_used_by_other_user"), 409));
    }
    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber !== null && phoneNumber !== void 0 ? phoneNumber : null;
    user.birthDate = birthDate ? new Date(birthDate) : null;
    user.gender = gender !== null && gender !== void 0 ? gender : null;
    if (image)
        user.imageUrl = image;
    user.booksGoal = booksGoal;
    user.examsGoal = examsGoal;
    user.intensePoints = intensePoints;
    if (language)
        user.language = language;
    await user.save();
    res.status(200).json({ user });
});
//# sourceMappingURL=profile.controller.js.map