"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userId) => jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
});
exports.createToken = createToken;
const createRefreshToken = (userId) => {
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_Refresh_SECRET_KEY, {
        expiresIn: process.env.JWT_Refresh_EXPIRE_TIME,
    });
    return refreshToken;
};
exports.createRefreshToken = createRefreshToken;
//# sourceMappingURL=createToken.js.map