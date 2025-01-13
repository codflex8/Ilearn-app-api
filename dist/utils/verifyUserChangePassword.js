"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserChangePassword = void 0;
const ApiError_1 = __importDefault(require("./ApiError"));
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
exports.verifyUserChangePassword = verifyUserChangePassword;
//# sourceMappingURL=verifyUserChangePassword.js.map