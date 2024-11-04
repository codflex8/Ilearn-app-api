"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const profileValidator_1 = require("../utils/validators/profileValidator");
const uploadFiles_1 = require("../middleware/uploadFiles");
const setImageUrl_1 = require("../middleware/setImageUrl");
const router = (0, express_1.Router)();
router.put("/", uploadFiles_1.upload.single("image"), (0, setImageUrl_1.setImageUrl)(), (0, validationMiddleware_1.validateData)(profileValidator_1.updateProfileValidator), profile_controller_1.updateProfileData);
exports.default = router;
//# sourceMappingURL=profile.router.js.map