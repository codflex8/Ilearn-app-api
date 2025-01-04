"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategoryByID = exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Categories_model_1 = require("../models/Categories.model");
const typeorm_1 = require("typeorm");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
exports.getCategories = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { name } = req.query;
    const { page, pageSize } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let query = {
        user: {
            id: (0, typeorm_1.Equal)(user.id),
        },
    };
    if (name) {
        query = Object.assign(Object.assign({}, query), { name: (0, typeorm_1.ILike)(`%${name}%`) });
    }
    const [categories, count] = await Categories_model_1.Category.findAndCount({
        where: query,
        skip,
        take,
        order: {
            createdAt: "DESC",
        },
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, categories));
});
exports.getCategoryByID = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const category = await Categories_model_1.Category.getUserCategoryById(user.id, id);
    res.status(200).json({ category });
});
exports.addCategory = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, image } = req.body;
    const user = req.user;
    const newCategory = Categories_model_1.Category.create({ name, imageUrl: image, user });
    await newCategory.save();
    delete newCategory.user;
    res.status(201).json({ category: newCategory });
});
exports.updateCategory = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name, image } = req.body;
    const user = req.user;
    const updateCategory = await Categories_model_1.Category.getUserCategoryById(user.id, id);
    updateCategory.name = name;
    updateCategory.imageUrl = image;
    await updateCategory.save();
    res.status(200).json({ category: updateCategory });
});
exports.deleteCategory = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const category = await Categories_model_1.Category.getUserCategoryById(user.id, id);
    await (category === null || category === void 0 ? void 0 : category.remove());
    res.status(200).json({ message: req.t("delete_success") });
});
//# sourceMappingURL=categories.controller.js.map