"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPolicy = exports.getPolicy = exports.addTerms = exports.getTerms = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const PolicyAndTerms_model_1 = require("../models/PolicyAndTerms.model");
exports.getTerms = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    const terms = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ terms: (_a = terms === null || terms === void 0 ? void 0 : terms.terms) !== null && _a !== void 0 ? _a : "" });
});
exports.addTerms = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { terms: newTerms } = req.body;
    let terms = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({
        where: {},
    });
    if (!terms) {
        terms = new PolicyAndTerms_model_1.PolicyAndTerms();
    }
    terms.terms = newTerms;
    await terms.save();
    res.status(200).json({ terms });
});
exports.getPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    const policy = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ policy: (_a = policy === null || policy === void 0 ? void 0 : policy.policy) !== null && _a !== void 0 ? _a : "" });
});
exports.addPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    const { policy: newPolicy, terms } = req.body;
    let policy = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({
        where: {},
    });
    if (!policy) {
        policy = new PolicyAndTerms_model_1.PolicyAndTerms();
    }
    policy.policy = newPolicy;
    policy.terms = terms;
    await policy.save();
    res.status(200).json({ policy: (_a = policy === null || policy === void 0 ? void 0 : policy.policy) !== null && _a !== void 0 ? _a : "" });
});
//# sourceMappingURL=termsAndPolicy.controller.js.map