"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = require("../../controllers/users/home.controller");
const router = (0, express_1.Router)();
router.get("/home", home_controller_1.home);
router.get("/archive", home_controller_1.archive);
exports.default = router;
//# sourceMappingURL=home.router.js.map