"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const termsAndPolicy_controller_1 = require("../controllers/termsAndPolicy.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const termsAndPolicyValidator_1 = require("../utils/validators/termsAndPolicyValidator");
const router = (0, express_1.Router)();
router.get("/terms", termsAndPolicy_controller_1.getTerms);
router.post("/terms", (0, validationMiddleware_1.validateData)(termsAndPolicyValidator_1.addTermValidator), termsAndPolicy_controller_1.addTerms);
router.get("/policy", termsAndPolicy_controller_1.getPolicy);
router.post("/policy", (0, validationMiddleware_1.validateData)(termsAndPolicyValidator_1.addPolicyValidator), termsAndPolicy_controller_1.addPolicy);
exports.default = router;
//# sourceMappingURL=termsAndPolicy.router.js.map