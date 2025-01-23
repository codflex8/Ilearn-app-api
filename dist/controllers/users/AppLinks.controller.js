"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppLinks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AppLinks_model_1 = require("../../models/AppLinks.model");
exports.getAppLinks = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b;
    const appLinks = await AppLinks_model_1.AppLinks.findOne({ where: {} });
    res.status(200).json({
        appLinks: {
            androidLink: (_a = appLinks === null || appLinks === void 0 ? void 0 : appLinks.androidLink) !== null && _a !== void 0 ? _a : "",
            appleLink: (_b = appLinks.appleLink) !== null && _b !== void 0 ? _b : "",
        },
    });
});
//# sourceMappingURL=AppLinks.controller.js.map