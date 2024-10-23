"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Books_model_1 = require("../models/Books.model");
const typeorm_1 = require("typeorm");
exports.getBooks = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [books, count] = yield Books_model_1.Book.findAndCount();
    res.status(200).json({ books, count });
}));
exports.getBookById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const book = yield Books_model_1.Book.findOne({ where: { id: (0, typeorm_1.Equal)(id) } });
    if (!book) {
        res.send(203);
        return;
    }
    res.status(200).json({ book });
}));
exports.createBook = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl, fileUrl, link, content } = req.body;
    const book = Books_model_1.Book.create({ name, imageUrl, fileUrl, link, content });
    yield book.save();
    res.status(201).json({ book });
}));
exports.updateBook = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, imageUrl, fileUrl, link, content } = req.body;
    const book = yield Books_model_1.Book.findOne({ where: { id: (0, typeorm_1.Equal)(id) } });
    book.name = name;
    book.imageUrl = imageUrl;
    book.fileUrl = fileUrl;
    book.link = link;
    book.content = content;
    yield book.save();
    res.status(200).json({ book });
}));
exports.deleteBook = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const book = yield Books_model_1.Book.delete(id);
    res.status(200).json({ book });
}));
//# sourceMappingURL=books.controller.js.map