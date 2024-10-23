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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategoryByID = exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Categories_model_1 = require("../models/Categories.model");
const typeorm_1 = require("typeorm");
exports.getCategories = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    const [categories, count] = yield Categories_model_1.Category.findAndCount({ where: query });
    res.status(200).json({ categories, count });
}));
exports.getCategoryByID = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield Categories_model_1.Category.findOne({
        where: { id: (0, typeorm_1.Equal)(id) },
        relations: ["books"],
    });
    if (!category) {
        res.status(203);
        return;
    }
    res.status(200).json({ category });
}));
exports.addCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, imageUrl } = req.body;
    const newCategory = Categories_model_1.Category.create({ name, imageUrl });
    yield newCategory.save();
    res.status(201).json({ category: newCategory });
}));
exports.updateCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    const updateCategory = yield Categories_model_1.Category.findOne({ where: { id: (0, typeorm_1.Equal)(id) } });
    updateCategory.name = name;
    updateCategory.imageUrl = imageUrl;
    yield updateCategory.save();
    res.status(200).json({ category: updateCategory });
}));
exports.deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedCategory = yield Categories_model_1.Category.delete(id);
    res.status(200).json({ category: deletedCategory });
}));
//# sourceMappingURL=categories.controller.js.map