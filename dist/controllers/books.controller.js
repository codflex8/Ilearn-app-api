"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWrongQuestions = exports.deleteBook = exports.setLocalPath = exports.updateBook = exports.addBook = exports.getBookById = exports.getBooks = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Books_model_1 = require("../models/Books.model");
const typeorm_1 = require("typeorm");
const Categories_model_1 = require("../models/Categories.model");
const GenericResponse_1 = require("../utils/GenericResponse");
const getPaginationData_1 = require("../utils/getPaginationData");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const uploadToAws_1 = require("../utils/uploadToAws");
const logger_1 = require("../utils/logger");
const Questions_model_1 = require("../models/Questions.model");
exports.getBooks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { page, pageSize, categoryId, name, forArchive } = req.query;
    const user = req.user;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const queryBuilder = Books_model_1.Book.createQueryBuilder("book")
        .leftJoinAndSelect("book.chatbots", "chatbot")
        .leftJoinAndSelect("book.quizes", "quiz")
        .leftJoinAndSelect("book.category", "category") // Ensure relations are available
        .where("book.userId = :userId", { userId: user.id });
    // Apply dynamic conditions
    if (name) {
        queryBuilder.andWhere("LOWER(book.name) LIKE LOWER(:name)", {
            name: `%${name}%`,
        });
    }
    if (categoryId) {
        queryBuilder.andWhere("category.id = :categoryId", {
            categoryId: categoryId.toString(),
        });
    }
    if (forArchive) {
        queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
            qb.where("quiz.id IS NOT NULL").orWhere("chatbot.id IS NOT NULL");
        }));
    }
    // Apply pagination and ordering
    if (forArchive) {
        queryBuilder
            .addOrderBy("quiz.createdAt", "DESC")
            .orderBy("chatbot.createdAt", "DESC"); // First order by chatbot.createdAt
    }
    else {
        queryBuilder.orderBy("book.createdAt", "DESC");
    }
    queryBuilder
        .skip(skip)
        .take(take)
        .select("book")
        .addSelect(["chatbot.createdAt", "quiz.createdAt", "category.id"]); // Then order by quiz.createdAt
    // Execute the query
    const [books, count] = await queryBuilder.getManyAndCount();
    // let condition: FindOptionsWhere<Book> = {
    //   user: {
    //     id: user.id,
    //   },
    // };
    // if (name) {
    //   condition = { ...condition, name: ILike(`%${name}%`) };
    // }
    // if (categoryId) {
    //   condition = {
    //     ...condition,
    //     category: {
    //       id: categoryId.toString(),
    //     },
    //   };
    // }
    // const [books, count] = await Book.findAndCount({
    //   where: forArchive
    //     ? [
    //         {
    //           ...condition,
    //           quizes: {
    //             id: Not(IsNull()),
    //           },
    //         },
    //         {
    //           ...condition,
    //           chatbots: {
    //             id: Not(IsNull()),
    //           },
    //         },
    //       ]
    //     : condition,
    //   skip,
    //   take,
    //   // relations: {
    //   //   category: true,
    //   // },
    //   order: {
    //     createdAt: "DESC",
    //   },
    // });
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
    var _a;
    const { name, image, link, content, categoryId, localPath } = req.body;
    const fileData = (_a = req.files["file"]) === null || _a === void 0 ? void 0 : _a[0];
    logger_1.httpLogger.info("upload new book", { fileData });
    try {
        if (!fileData && !link && !content) {
            return next(new ApiError_1.default(req.t("something_wrong_with_file_data"), 400));
        }
        const user = req.user;
        const book = Books_model_1.Book.create({
            name,
            imageUrl: image !== null && image !== void 0 ? image : null,
            fileUrl: fileData === null || fileData === void 0 ? void 0 : fileData.location,
            link,
            content,
            user,
            s3Key: fileData === null || fileData === void 0 ? void 0 : fileData.key,
            localPath,
        });
        if (categoryId) {
            const category = await Categories_model_1.Category.getUserCategoryById(user.id, categoryId);
            if (!category) {
                throw new ApiError_1.default(req.t("category_not_found"), 400);
            }
            book.category = category;
        }
        await book.save();
        delete book.user;
        delete book.category;
        res.status(201).json({ book });
    }
    catch (error) {
        if (fileData) {
            logger_1.httpLogger.error(error.message, { fileData });
            (0, uploadToAws_1.deleteS3File)(fileData.key);
        }
        next(error);
    }
});
exports.updateBook = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { name, image } = req.body;
    const book = await Books_model_1.Book.getUserBookById(user.id, id);
    if (!book) {
        return next(new ApiError_1.default(req.t("book_not_found"), 400));
    }
    book.name = name;
    if (image)
        book.imageUrl = image;
    // if (fileUrl) book.fileUrl = fileUrl;
    // if (link) book.link = link;
    // if (localPath) book.localPath = localPath;
    // book.content = content;
    // const category = await Category.getUserCategoryById(user.id, categoryId);
    // if (!category) {
    //   return next(new ApiError(req.t("category_not_found"), 400));
    // }
    // book.category = category;
    await book.save();
    res.status(200).json({ book });
});
exports.setLocalPath = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { localPath } = req.body;
    const book = await Books_model_1.Book.getUserBookById(user.id, id, false);
    if (!book) {
        return next(new ApiError_1.default(req.t("book_not_found"), 400));
    }
    book.localPath = localPath;
    await book.save();
    res.status(200).json({ book });
});
exports.deleteBook = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const book = await Books_model_1.Book.findOne({
        where: {
            id,
            user: {
                id: user.id,
            },
        },
    });
    if (book) {
        await book.remove();
        await (0, uploadToAws_1.deleteS3File)(book.s3Key);
    }
    res.status(200).json({ message: req.t("delete_success") });
});
exports.getWrongQuestions = (0, express_async_handler_1.default)(async (req, res, next) => {
    const bookId = req.params.id;
    const questions = await Questions_model_1.Question.createQueryBuilder("question")
        .leftJoin("question.quiz", "quiz")
        .leftJoin("quiz.books", "book")
        .where("book.id = :bookId", { bookId })
        .andWhere("question.userAnswerIndex != question.correctAnswerIndex")
        .getMany();
    res.status(200).json({ questions });
});
//# sourceMappingURL=books.controller.js.map