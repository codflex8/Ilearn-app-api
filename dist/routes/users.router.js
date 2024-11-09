"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.get("/users", users_controller_1.getUsers);
exports.default = router;
//# sourceMappingURL=users.router.js.map