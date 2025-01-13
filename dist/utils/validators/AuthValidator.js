"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UsersRoles = exports.addFcmValidation = exports.twitterAuthValidator = exports.socialMediaAuthValidator = exports.resetPasswordValidator = exports.verifyEmailValidator = exports.verifyForgetPasswordValidator = exports.forgetPasswordValidator = exports.signUpValidator = exports.signInValidator = exports.LanguageEnum = exports.GenderEnum = void 0;
const zod_1 = require("zod");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var LanguageEnum;
(function (LanguageEnum) {
    LanguageEnum["english"] = "en";
    LanguageEnum["arabic"] = "ar";
})(LanguageEnum || (exports.LanguageEnum = LanguageEnum = {}));
exports.signInValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    fcm: zod_1.z.string().optional(),
});
exports.signUpValidator = exports.signInValidator.extend({
    username: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional().nullable(),
});
exports.forgetPasswordValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.verifyForgetPasswordValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    resetCode: zod_1.z.string().length(4),
});
exports.verifyEmailValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    verifyCode: zod_1.z.string().length(4),
});
exports.resetPasswordValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.socialMediaAuthValidator = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.twitterAuthValidator = zod_1.z.object({
    authToken: zod_1.z.string(),
    authTokenSecret: zod_1.z.string(),
});
exports.addFcmValidation = zod_1.z.object({
    fcm: zod_1.z.string(),
});
var UsersRoles;
(function (UsersRoles) {
    UsersRoles["user"] = "user";
    UsersRoles["admin"] = "admin";
})(UsersRoles || (exports.UsersRoles = UsersRoles = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["active"] = "active";
    UserStatus["unactive"] = "unactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
//# sourceMappingURL=AuthValidator.js.map