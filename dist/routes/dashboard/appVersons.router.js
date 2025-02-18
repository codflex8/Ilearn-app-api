"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const appLinksValidator_1 = require("../../utils/validators/appLinksValidator");
const appLinks_controller_1 = require("../../controllers/dashboard/appLinks.controller");
const router = (0, express_1.Router)();
router.post("/", (0, validationMiddleware_1.validateData)(appLinksValidator_1.appVersionsValidator), appLinks_controller_1.addAppVersions);
exports.default = router;
//# sourceMappingURL=appVersons.router.js.map