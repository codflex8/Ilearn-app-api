"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../../controllers/dashboard/users.controller");
const router = (0, express_1.Router)();
router.get("/", users_controller_1.getUsers);
router.post("/:id/status", users_controller_1.toggleUserStatus);
router.delete("/:id", users_controller_1.removeUserStatus);
exports.default = router;
//# sourceMappingURL=users.router.js.map