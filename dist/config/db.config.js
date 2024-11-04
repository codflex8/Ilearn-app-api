"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_User,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB,
    pool: {
        max: Number(process.env.Pool_Max) || 5,
        min: Number(process.env.Pool_Min) || 0,
        acquire: Number(process.env.Pool_Acquire) || 30000,
        idle: Number(process.env.Pool_Idle) || 10000,
    },
};
exports.default = dbConfig;
//# sourceMappingURL=db.config.js.map