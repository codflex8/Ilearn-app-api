"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../../controllers/users/categories.controller");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const CategoryValidator_1 = require("../../utils/validators/CategoryValidator");
const uploadFiles_1 = require("../../middleware/uploadFiles");
const router = (0, express_1.Router)();
router.get("/", categories_controller_1.getCategories);
router.post("/", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(CategoryValidator_1.addCategoryValidator), categories_controller_1.addCategory);
router.get("/:id", categories_controller_1.getCategoryByID);
router.put("/:id", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(CategoryValidator_1.addCategoryValidator), categories_controller_1.updateCategory);
router.delete("/:id", categories_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.router.js.map