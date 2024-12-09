"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTermsAndPolicy = exports.getTermsAndPolicy = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const PolicyAndTerms_model_1 = require("../models/PolicyAndTerms.model");
exports.getTermsAndPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
    const termsAndPolicy = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ termsAndPolicy });
});
exports.addTermsAndPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { policy, terms } = req.body;
    let termsAndPolicy = await PolicyAndTerms_model_1.PolicyAndTerms.findOne({
        where: {},
    });
    if (!termsAndPolicy) {
        termsAndPolicy = new PolicyAndTerms_model_1.PolicyAndTerms();
    }
    termsAndPolicy.policy = policy;
    termsAndPolicy.terms = terms;
    await termsAndPolicy.save();
    res.status(200).json({ termsAndPolicy });
});
//# sourceMappingURL=termsAndPolicy.controller.js.map