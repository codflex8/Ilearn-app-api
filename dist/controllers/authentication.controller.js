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
exports.twitterAuthSignIn = exports.twitterAuthSignUp = exports.facebookAuthSignIn = exports.facebookAuthSignUp = exports.googleAuthSignIn = exports.googleAuthSignUp = exports.resetPassword = exports.verifyPassResetCode = exports.forgotPassword = exports.protect = exports.refreshToken = exports.signOut = exports.signIn = exports.verifyUserEmail = exports.resendVerifyCode = exports.signup = void 0;
const User_model_1 = require("../models/User.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcrypt = __importStar(require("bcryptjs"));
const createToken_1 = require("../utils/createToken");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const generateCode_1 = __importDefault(require("../utils/generateCode"));
const typeorm_1 = require("typeorm");
const getUserFromToken_1 = require("../utils/getUserFromToken");
const socialMediaAuth_1 = require("../utils/socialMediaAuth");
exports.signup = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { username, email, password, image } = req.body;
    const isUserExist = await User_model_1.User.findOne({
        where: {
            email: (0, typeorm_1.Equal)(req.body.email),
        },
    });
    if (isUserExist) {
        return next(new ApiError_1.default(req.t("this_email_signed_up_already"), 409));
    }
    // 1- Create user
    const cryptedPassword = await (0, bcryptPassword_1.default)(password);
    const user = await User_model_1.User.create({
        username,
        email,
        password: cryptedPassword,
        imageUrl: image,
    });
    const resetCode = (0, generateCode_1.default)();
    user.verifyCode = resetCode;
    await user.save();
    delete user.password;
    delete user.passwordChangedAt;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    delete user.verifyCode;
    // 2- Generate token
    const token = (0, createToken_1.createToken)(user.id);
    // 3- send verify email
    const message = `Hi ${user.username},\n Thanks for signing up with Ilearn.this is verify code, this is verify code ${resetCode}`;
    try {
        await (0, sendEmail_1.default)(user.email, "Your verify code (valid for 10 min)", message);
    }
    catch (error) {
        user.verifyCode = undefined;
        await user.save();
        return next(new ApiError_1.default("There is an error in sending email", 400));
    }
    res.status(201).json({ message: req.t("sign_up_success") });
});
exports.resendVerifyCode = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        return next(new ApiError_1.default(req.t("emailNotExist"), 404));
    }
    const resetCode = (0, generateCode_1.default)();
    user.verifyCode = resetCode;
    await user.save();
    const message = `Hi ${user.username},\n Thanks for signing up with Ilearn.this is verify code, this is verify code ${resetCode}`;
    try {
        await (0, sendEmail_1.default)(user.email, "Your verify code", message);
    }
    catch (error) {
        user.verifyCode = undefined;
        await user.save();
        return next(new ApiError_1.default("There is an error in sending email", 400));
    }
    res.status(200).json({ message: "email sent success" });
});
exports.verifyUserEmail = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        return next(new ApiError_1.default(req.t("emailNotExist"), 404));
    }
    if (user.verifyCode != req.body.verifyCode) {
        return next(new ApiError_1.default(req.t("invalid_code"), 400));
    }
    user.verifyEmail = true;
    user.verifyCode = undefined;
    await user.save();
    res.status(200).json({ message: "email verified" });
});
exports.signIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await User_model_1.User.findOneBy({ email: (0, typeorm_1.Equal)(req.body.email) });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError_1.default(req.t("IncorrectEmailPasswod"), 401));
    }
    if (!user.verifyEmail) {
        return next(new ApiError_1.default(req.t("emailNotVerified"), 401));
    }
    const token = (0, createToken_1.createToken)(user.id);
    const refreshToken = (0, createToken_1.createRefreshToken)(user.id);
    delete user.password;
    res.status(200).json({ user, token, refreshToken });
});
exports.signOut = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    user.fcm = null;
    await user.save();
    res.status(200).json({ message: "logout success" });
});
const refreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    // if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json({ message: 'Refresh token not found' });
    // }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_Refresh_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const currentUser = await User_model_1.User.findOne({
            where: {
                id: decoded === null || decoded === void 0 ? void 0 : decoded.userId,
            },
        });
        if (!currentUser)
            return res.status(401).json({ message: "Invalid refresh token" });
        try {
            verifyUserChangePassword(currentUser, decoded, req.t);
        }
        catch (error) {
            return next(error);
        }
        const newAccessToken = (0, createToken_1.createToken)(decoded.userId);
        res.json({ token: newAccessToken });
    });
};
exports.refreshToken = refreshToken;
exports.protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError_1.default(req.t("unauthorized"), 401));
    }
    // 2) Verify token (no change happens, expired token)
    const { currentUser, decoded } = await (0, getUserFromToken_1.getUserFromToken)(token);
    if (!currentUser) {
        return next(new ApiError_1.default(req.t("unauthorized"), 401));
    }
    try {
        verifyUserChangePassword(currentUser, decoded, req.t);
    }
    catch (error) {
        return next(error);
    }
    delete currentUser.password;
    delete currentUser.passwordChangedAt;
    delete currentUser.passwordResetCode;
    delete currentUser.passwordResetExpires;
    delete currentUser.passwordResetVerified;
    req.user = currentUser;
    next();
});
const verifyUserChangePassword = (currentUser, decoded, t) => {
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
        // Password changed after token created (Error)
        if (decoded.iat && passChangedTimestamp > decoded.iat) {
            throw new ApiError_1.default(t("passwordChanged"), 401);
        }
    }
};
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    // 1) Get user by email
    const user = await User_model_1.User.findOne({ where: { email: (0, typeorm_1.Equal)(req.body.email) } });
    if (!user) {
        return next(new ApiError_1.default(req.t("emailNotExist", { email: req.body.email }), 404));
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = (0, generateCode_1.default)();
    // Save hashed password reset code into db
    user.passwordResetCode = resetCode;
    // Add expiration time for password reset code (10 min)
    const oneMinuteLater = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetExpires = oneMinuteLater;
    user.passwordResetVerified = false;
    await user.save();
    // 3) Send the reset code via email
    const message = `Hi ${user.username},\n We received a request to reset the password on your Ilearn Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await (0, sendEmail_1.default)(user.email, "Your password reset code (valid for 10 min)", message);
    }
    catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError_1.default("There is an error in sending email", 400));
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
        return next(new ApiError_1.default(req.t("expired_code_please_try_again"), 400));
    }
    const timeDiff = Date.now() - Number(user.passwordResetExpires);
    const oneMinutesInMilliesecond = 60000 * 10;
    if (timeDiff > oneMinutesInMilliesecond ||
        user.passwordResetCode != req.body.resetCode) {
        return next(new ApiError_1.default(req.t("invalid_reset_code_please_login_again"), 400));
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
        return next(new ApiError_1.default(req.t("emailNotExist"), 404));
    }
    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError_1.default(req.t("inva"), 400));
    }
    const cryptedPassword = await (0, bcryptPassword_1.default)(req.body.password);
    user.password = cryptedPassword;
    user.passwordChangedAt = new Date();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;
    await user.save();
    // 3) if everything is ok, generate token
    const token = (0, createToken_1.createToken)(user.id);
    res.status(200).json({ token });
});
const createSocialMediaUser = async ({ email, username, imageUrl, googleId, facebookId, twitterId, }) => {
    const newUser = User_model_1.User.create({
        email,
        username,
        imageUrl,
        googleId,
        facebookId,
        twitterId,
        verifyEmail: true,
    });
    await newUser.save();
    return newUser;
};
exports.googleAuthSignUp = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { token } = req.body;
    const { email, username, imageUrl, userId } = await (0, socialMediaAuth_1.verifyGoogleAuth)(token);
    const isUserExist = await User_model_1.User.findOne({
        where: [
            {
                googleId: userId,
            },
            {
                email,
            },
        ],
    });
    if (isUserExist) {
        if (email === isUserExist.email && !isUserExist.googleId) {
            return next(new ApiError_1.default(req.t("this_email_signed_up_already"), 409));
        }
        return next(new ApiError_1.default(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
        email,
        username,
        imageUrl,
        googleId: userId,
    });
    const authToken = (0, createToken_1.createToken)(newUser.id);
    res.status(201).json({
        message: req.t("google_signup_success"),
        user: newUser,
        token: authToken,
    });
});
exports.googleAuthSignIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { token } = req.body;
    const userData = await (0, socialMediaAuth_1.verifyGoogleAuth)(token);
    const user = await User_model_1.User.getPublicUserDataByEmail({
        googleId: userData.userId,
    });
    if (!user) {
        return next(new ApiError_1.default(req.t("user_email_not_exist"), 409));
    }
    const authToken = (0, createToken_1.createToken)(user.id);
    res.status(201).json({ user, token: authToken });
});
exports.facebookAuthSignUp = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { token } = req.body;
    const { email, username, imageUrl, userId } = await (0, socialMediaAuth_1.getFacebookUserData)(token);
    const isUserExist = await User_model_1.User.findOne({
        where: [
            {
                facebookId: userId,
            },
            {
                email,
            },
        ],
    });
    if (isUserExist) {
        if (email === isUserExist.email && !isUserExist.facebookId) {
            return next(new ApiError_1.default(req.t("this_email_signed_up_already"), 409));
        }
        return next(new ApiError_1.default(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
        email,
        username,
        imageUrl,
        facebookId: userId,
    });
    const authToken = (0, createToken_1.createToken)(newUser.id);
    res.status(201).json({
        message: req.t("facebook_signup_success"),
        user: newUser,
        token: authToken,
    });
});
exports.facebookAuthSignIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { token } = req.body;
    const { userId } = await (0, socialMediaAuth_1.getFacebookUserData)(token);
    const user = await User_model_1.User.getPublicUserDataByEmail({ facebookId: userId });
    if (!user) {
        return next(new ApiError_1.default(req.t("user_not_signed_up"), 400));
    }
    const authToken = (0, createToken_1.createToken)(user.id);
    res.status(201).json({ user, token: authToken });
});
exports.twitterAuthSignUp = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { authToken, authTokenSecret } = req.body;
    const { email, username, imageUrl, userId } = await (0, socialMediaAuth_1.getTwitterUserData)(authToken, authTokenSecret);
    const isUserExist = await User_model_1.User.findOne({
        where: [
            {
                twitterId: userId,
            },
            {
                email,
            },
        ],
    });
    if (isUserExist) {
        if (email === isUserExist.email && !isUserExist.twitterId) {
            return next(new ApiError_1.default(req.t("this_email_signed_up_already"), 409));
        }
        return next(new ApiError_1.default(req.t("user_already_signed_up"), 409));
    }
    const newUser = await createSocialMediaUser({
        email,
        username,
        imageUrl,
        twitterId: userId,
    });
    const token = (0, createToken_1.createToken)(newUser.id);
    res.status(201).json({
        message: req.t("twitter_signup_success"),
        user: newUser,
        token,
    });
});
exports.twitterAuthSignIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { authToken, authTokenSecret } = req.body;
    const userData = await (0, socialMediaAuth_1.getTwitterUserData)(authToken, authTokenSecret);
    const user = await User_model_1.User.getPublicUserDataByEmail({
        twitterId: userData.userId,
    });
    if (!user) {
        return next(new ApiError_1.default(req.t("user_email_not_exist"), 409));
    }
    const token = (0, createToken_1.createToken)(user.id);
    res.status(201).json({ user, token });
});
//# sourceMappingURL=authentication.controller.js.map