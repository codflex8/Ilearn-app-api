"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookmark_controller_1 = require("../controllers/bookmark.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const BookmarkValidator_1 = require("../utils/validators/BookmarkValidator");
const router = (0, express_1.Router)();
router.get("/", bookmark_controller_1.getBookmarks);
router.post("/", (0, validationMiddleware_1.validateData)(BookmarkValidator_1.addBookmarkValidator), bookmark_controller_1.addBookmark);
exports.default = router;
//# sourceMappingURL=bookmarks.router.js.map