"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AppLinks_controller_1 = require("../../controllers/users/AppLinks.controller");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const appLinksValidator_1 = require("../../utils/validators/appLinksValidator");
const router = (0, express_1.Router)();
router.get("/", AppLinks_controller_1.getAppLinks);
router.post("/", (0, validationMiddleware_1.validateData)(appLinksValidator_1.appLinksValidator), AppLinks_controller_1.addAppLinks);
exports.default = router;
//# sourceMappingURL=appLinks.router.js.map