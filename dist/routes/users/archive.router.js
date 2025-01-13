"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archive_controller_1 = require("../../controllers/users/archive.controller");
const router = (0, express_1.Router)();
router.get("/chatbots", archive_controller_1.getArchiveChatbots);
router.get("/quizes", archive_controller_1.getArchiveQuizes);
exports.default = router;
//# sourceMappingURL=archive.router.js.map