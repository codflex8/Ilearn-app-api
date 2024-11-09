"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archive = exports.home = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Categories_model_1 = require("../models/Categories.model");
const GenericResponse_1 = require("../utils/GenericResponse");
const Books_model_1 = require("../models/Books.model");
const typeorm_1 = require("typeorm");
exports.home = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const [categories, categoriesCount] = await Categories_model_1.Category.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    const [books, booksCount] = await Books_model_1.Book.findAndCount({
        where: {
            user: {
                id: user.id,
            },
        },
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    res.status(200).json({
        categories: new GenericResponse_1.GenericResponse(Number(1), 10, categoriesCount, categories),
        books: new GenericResponse_1.GenericResponse(Number(1), 10, booksCount, books),
    });
});
exports.archive = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const userFilter = {
        user: {
            id: user.id,
        },
    };
    const [categories, categoriesCount] = await Categories_model_1.Category.findAndCount({
        where: [
            Object.assign(Object.assign({}, userFilter), { books: {
                    quizes: {
                        id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                    },
                } }),
            Object.assign(Object.assign({}, userFilter), { books: {
                    chatbots: {
                        id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                    },
                } }),
        ],
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    const [books, booksCount] = await Books_model_1.Book.findAndCount({
        where: [
            Object.assign(Object.assign({}, userFilter), { quizes: {
                    id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                } }),
            Object.assign(Object.assign({}, userFilter), { chatbots: {
                    id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                } }),
        ],
        take: 10,
        order: {
            createdAt: "DESC",
        },
    });
    res.status(200).json({
        categories: new GenericResponse_1.GenericResponse(Number(1), 10, categoriesCount, categories),
        books: new GenericResponse_1.GenericResponse(Number(1), 10, booksCount, books),
    });
});
//# sourceMappingURL=home.controller.js.map