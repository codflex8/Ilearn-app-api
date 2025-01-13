"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Notifications_controller_1 = require("../../controllers/users/Notifications.controller");
const router = (0, express_1.Router)();
router.get("/", Notifications_controller_1.getNotifications);
exports.default = router;
//# sourceMappingURL=notifications.router.js.map