"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthValidator = exports.resetPasswordValidator = exports.verifyForgetPasswordValidator = exports.forgetPasswordValidator = exports.signUpValidator = exports.signInValidator = exports.GenderEnum = void 0;
const zod_1 = require("zod");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
exports.signInValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
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
exports.resetPasswordValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.googleAuthValidator = zod_1.z.object({
    token: zod_1.z.string(),
});
//# sourceMappingURL=AuthValidator.js.map