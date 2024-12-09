"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const termsAndPolicy_controller_1 = require("../controllers/termsAndPolicy.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const termsAndPolicyValidator_1 = require("../utils/validators/termsAndPolicyValidator");
const router = (0, express_1.Router)();
router.get("/", termsAndPolicy_controller_1.getTermsAndPolicy);
router.post("/", (0, validationMiddleware_1.validateData)(termsAndPolicyValidator_1.addTermAndPolicyValidator), termsAndPolicy_controller_1.addTermsAndPolicy);
exports.default = router;
//# sourceMappingURL=termsAndPolicy.router.js.map