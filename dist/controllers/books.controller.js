"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.addBook = exports.getBookById = exports.getBooks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Books_model_1 = require("../models/Books.model");
const typeorm_1 = require("typeorm");
const Categories_model_1 = require("../models/Categories.model");
const GenericResponse_1 = require("../utils/GenericResponse");
const getPaginationData_1 = require("../utils/getPaginationData");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.getBooks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { categoryId, name } = req.query;
    const user = req.user;
    const { page, pageSize } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let condition = {
        user: {
            id: user.id,
        },
    };
    if (name) {
        condition = Object.assign(Object.assign({}, condition), { name: (0, typeorm_1.ILike)(`%${name}%`) });
    }
    if (categoryId) {
        condition = Object.assign(Object.assign({}, condition), { category: {
                id: categoryId.toString(),
            } });
    }
    const [books, count] = await Books_model_1.Book.findAndCount({
        where: condition,
        skip,
        take,
        relations: {
            category: true,
        },
        order: {
            createdAt: "DESC",
        },
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, books));
});
exports.getBookById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const book = await Books_model_1.Book.getUserBookById(user.id, id);
    res.status(200).json({ book });
});
exports.addBook = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, imageUrl, fileUrl, link, content, categoryId } = req.body;
    const user = req.user;
    const book = Books_model_1.Book.create({ name, imageUrl, fileUrl, link, content, user });
    const category = await Categories_model_1.Category.getUserCategoryById(user.id, categoryId);
    if (!category) {
        return next(new ApiError_1.default("category not found", 400));
    }
    book.category = category;
    await book.save();
    res.status(201).json({ book });
});
exports.updateBook = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { name, imageUrl, fileUrl, link, content, categoryId } = req.body;
    const book = await Books_model_1.Book.getUserBookById(user.id, id);
    book.name = name;
    book.imageUrl = imageUrl;
    book.fileUrl = fileUrl;
    book.link = link;
    book.content = content;
    const category = await Categories_model_1.Category.getUserCategoryById(user.id, categoryId);
    if (!category) {
        return next(new ApiError_1.default("category not found", 400));
    }
    book.category = category;
    await book.save();
    res.status(200).json({ book });
});
exports.deleteBook = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const book = await Books_model_1.Book.delete(id);
    res.status(200).json({ message: "delete success" });
});
//# sourceMappingURL=books.controller.js.map