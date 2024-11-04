"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const bcryptPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, 12);
};
exports.default = bcryptPassword;
//# sourceMappingURL=bcryptPassword.js.map