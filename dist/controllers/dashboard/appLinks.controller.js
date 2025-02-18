"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAppVersions = exports.addAppLinks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AppLinks_model_1 = require("../../models/AppLinks.model");
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
exports.addAppVersions = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { androidVersion, appleVersion } = req.body;
    let appVersions = await AppLinks_model_1.AppLinks.findOne({
        where: {},
    });
    if (!appVersions) {
        appVersions = new AppLinks_model_1.AppLinks();
    }
    appVersions.androidVersion = androidVersion;
    appVersions.appleVersion = appleVersion;
    await appVersions.save();
    res.status(200).json({ appVersions });
});
//# sourceMappingURL=appLinks.controller.js.map