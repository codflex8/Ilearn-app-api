import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Book } from "../../models/Books.model";
import { Brackets } from "typeorm";
import { Category } from "../../models/Categories.model";
import { GenericResponse } from "../../utils/GenericResponse";
import { getPaginationData } from "../../utils/getPaginationData";
import ApiError from "../../utils/ApiError";
import { deleteS3File } from "../../utils/uploadToAws";
import { httpLogger } from "../../utils/logger";
import { Question } from "../../models/Questions.model";

export const getBooks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, categoryId, name, forArchive } = req.query;
    const user = req.user;
    const { take, skip } = getPaginationData({ page, pageSize });
    const queryBuilder = Book.createQueryBuilder("book")
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
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("quiz.id IS NOT NULL").orWhere("chatbot.id IS NOT NULL");
        })
      );
    }

    // Apply pagination and ordering
    if (forArchive) {
      queryBuilder
        .addOrderBy("quiz.createdAt", "DESC")
        .orderBy("chatbot.createdAt", "DESC"); // First order by chatbot.createdAt
    } else {
      queryBuilder.orderBy("book.createdAt", "DESC");
    }
    queryBuilder
      .skip(skip)
      .take(take)
      .select("book")
      .addSelect(["chatbot.createdAt", "quiz.createdAt", "category.id"]); // Then order by quiz.createdAt

    // Execute the query
    const [books, count] = await queryBuilder.getManyAndCount();

    res
      .status(200)
      .json(new GenericResponse<Book>(Number(page), take, count, books));
  }
);

export const getBookById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const book = await Book.getUserBookById(user.id, id);
    res.status(200).json({ book });
  }
);

export const addBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, image, link, content, categoryId, localPath } = req.body;
    const fileData = req.files["file"]?.[0];
    httpLogger.info("upload new book", { fileData });
    try {
      if (!fileData && !link && !content) {
        return next(new ApiError(req.t("something_wrong_with_file_data"), 400));
      }
      const user = req.user;
      const book = Book.create({
        name,
        imageUrl: image ?? null,
        fileUrl: fileData?.location,
        link,
        content,
        user,
        s3Key: fileData?.key,
        localPath,
      });
      if (categoryId) {
        const category = await Category.getUserCategoryById(
          user.id,
          categoryId
        );
        if (!category) {
          throw new ApiError(req.t("category_not_found"), 400);
        }
        book.category = category;
      }

      await book.save();
      delete book.user;
      delete book.category;
      res.status(201).json({ book });
    } catch (error: any) {
      if (fileData) {
        httpLogger.error(error.message, { fileData });
        deleteS3File(fileData.key);
      }
      next(error);
    }
  }
);

export const updateBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { name, image } = req.body;
    const book = await Book.getUserBookById(user.id, id);
    if (!book) {
      return next(new ApiError(req.t("book_not_found"), 400));
    }
    book.name = name;
    if (image) book.imageUrl = image;
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
  }
);

export const setLocalPath = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { localPath } = req.body;
    const book = await Book.getUserBookById(user.id, id, false);
    if (!book) {
      return next(new ApiError(req.t("book_not_found"), 400));
    }
    book.localPath = localPath;
    await book.save();
    res.status(200).json({ book });
  }
);

export const deleteBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const book = await Book.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    if (book) {
      await book.remove();
      await deleteS3File(book.s3Key);
    }
    res.status(200).json({ message: req.t("delete_success") });
  }
);

export const getWrongQuestions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id;
    const quizId = req.query.quizId;
    const querable = await Question.createQueryBuilder("question")
      .leftJoinAndSelect("question.quiz", "quiz")
      .leftJoin("quiz.books", "book")
      .where("book.id = :bookId", { bookId })
      .andWhere("question.isCorrect = 0");
    if (quizId) {
      querable.andWhere("quiz.id = :quizId", { quizId });
    }
    res.status(200).json({
      questions: await querable
        .orderBy("RAND()") // MySQL random ordering
        .limit(3)
        .getMany(),
    });
  }
);
