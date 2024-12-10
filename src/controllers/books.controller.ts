import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Book } from "../models/Books.model";
import { FindOptionsWhere, ILike, IsNull, Not } from "typeorm";
import { Category } from "../models/Categories.model";
import { GenericResponse } from "../utils/GenericResponse";
import { getPaginationData } from "../utils/getPaginationData";
import ApiError from "../utils/ApiError";
import { deleteS3File } from "../utils/uploadToAws";
import { httpLogger } from "../utils/logger";

export const getBooks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, categoryId, name, forArchive } = req.query;
    const user = req.user;
    const { take, skip } = getPaginationData({ page, pageSize });
    let condition: FindOptionsWhere<Book> = {
      user: {
        id: user.id,
      },
    };

    if (name) {
      condition = { ...condition, name: ILike(`%${name}%`) };
    }
    if (categoryId) {
      condition = {
        ...condition,
        category: {
          id: categoryId.toString(),
        },
      };
    }

    const [books, count] = await Book.findAndCount({
      where: forArchive
        ? [
            {
              ...condition,
              quizes: {
                id: Not(IsNull()),
              },
            },
            {
              ...condition,
              chatbots: {
                id: Not(IsNull()),
              },
            },
          ]
        : condition,
      skip,
      take,
      // relations: {
      //   category: true,
      // },
      order: {
        createdAt: "DESC",
      },
    });
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
    const { name, image, fileUrl, link, content, categoryId, localPath } =
      req.body;
    console.log("categoryIdddddd", categoryId);
    const fileData = req.files["file"]?.[0];
    httpLogger.info("upload new book", { fileData });
    console.log("fileDataaaaaaa", fileData);
    try {
      if (!fileData) {
        console.log("fileData", fileData);
        return next(new ApiError("somthing wrong with file data", 400));
      }
      const user = req.user;
      const book = Book.create({
        name,
        imageUrl: image ?? null,
        fileUrl: fileData.location,
        link,
        content,
        user,
        s3Key: fileData.key,
        localPath,
      });
      if (categoryId) {
        const category = await Category.getUserCategoryById(
          user.id,
          categoryId
        );
        if (!category) {
          throw new ApiError("category not found", 400);
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
    const { name, image, fileUrl, link, content, categoryId, localPath } =
      req.body;
    const book = await Book.getUserBookById(user.id, id);
    if (!book) {
      return next(new ApiError("book not found", 400));
    }
    book.name = name;
    if (image) book.imageUrl = image;
    if (fileUrl) book.fileUrl = fileUrl;
    if (link) book.link = link;
    if (localPath) book.localPath = localPath;
    book.content = content;
    const category = await Category.getUserCategoryById(user.id, categoryId);
    if (!category) {
      return next(new ApiError("category not found", 400));
    }
    book.category = category;
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
      return next(new ApiError("book not found", 400));
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
    res.status(200).json({ message: "delete success" });
  }
);
