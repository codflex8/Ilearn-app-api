"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAppLinks = exports.getAppLinks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AppLinks_model_1 = require("../models/AppLinks.model");
exports.getAppLinks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const appLinks = await AppLinks_model_1.AppLinks.findOne({ where: {} });
    res.status(200).json({ appLinks });
});
exports.addAppLinks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { androidLink, appleLink } = req.body;
    let termsAndPolicy = await AppLinks_model_1.AppLinks.findOne({
        where: {},
    });
    if (!termsAndPolicy) {
        termsAndPolicy = new AppLinks_model_1.AppLinks();
    }
    termsAndPolicy.androidLink = androidLink;
    termsAndPolicy.appleLink = appleLink;
    await termsAndPolicy.save();
    res.status(200).json({ termsAndPolicy });
});
//# sourceMappingURL=AppLinks.controller.js.map