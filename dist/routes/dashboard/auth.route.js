"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_controller_1 = require("../../controllers/dashboard/authenticate.controller");
const router = (0, express_1.Router)();
router.post("/sign-in", authenticate_controller_1.signin);
router.post("/default-admin", authenticate_controller_1.defaultAdmin);
router.post("/add-admin", authenticate_controller_1.protectAdmin, authenticate_controller_1.addAdmin);
exports.default = router;
//# sourceMappingURL=auth.route.js.map