"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const AuthValidator_1 = require("../utils/validators/AuthValidator");
const router = (0, express_1.Router)();
router.get("/users", users_controller_1.getUsers);
router.post("/users/add-fcm", (0, validationMiddleware_1.validateData)(AuthValidator_1.addFcmValidation), users_controller_1.addFcmToUser);
exports.default = router;
//# sourceMappingURL=users.router.js.map