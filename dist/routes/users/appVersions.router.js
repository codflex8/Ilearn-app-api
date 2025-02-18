"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AppLinks_controller_1 = require("../../controllers/users/AppLinks.controller");
const router = (0, express_1.Router)();
router.get("/", AppLinks_controller_1.getAppVersions);
exports.default = router;
//# sourceMappingURL=appVersions.router.js.map