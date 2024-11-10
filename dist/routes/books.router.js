"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("../controllers/books.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const BookValidator_1 = require("../utils/validators/BookValidator");
const uploadFiles_1 = require("../middleware/uploadFiles");
const setImageUrl_1 = require("../middleware/setImageUrl");
const router = (0, express_1.Router)();
router.get("/", books_controller_1.getBooks);
router.post("/", uploadFiles_1.upload.single("image"), (0, setImageUrl_1.setImageUrl)(), (0, validationMiddleware_1.validateData)(BookValidator_1.addBookValidator), books_controller_1.addBook);
router.get("/:id", books_controller_1.getBookById);
router.put("/:id", uploadFiles_1.upload.single("image"), (0, setImageUrl_1.setImageUrl)(), (0, validationMiddleware_1.validateData)(BookValidator_1.addBookValidator), books_controller_1.updateBook);
router.delete("/:id", books_controller_1.deleteBook);
exports.default = router;
//# sourceMappingURL=books.router.js.map