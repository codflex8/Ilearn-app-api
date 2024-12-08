import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Book } from "../models/Books.model";
import { FindOptionsWhere, ILike, IsNull, Not } from "typeorm";
import { Category } from "../models/Categories.model";
import { GenericResponse } from "../utils/GenericResponse";
import { getPaginationData } from "../utils/getPaginationData";
import ApiError from "../utils/ApiError";
import { dynamicStorage } from "../middleware/uploadFiles";
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
    const { name, image, fileUrl, link, content, categoryId } = req.body;
    const fileData = req.files["file"]?.[0];
    try {
      if (!fileData) {
        console.log("fileData", fileData);
        return next(new ApiError("somthing wrong with file data", 400));
      }
      console.log("req.fileeeee", req.files);
      const user = req.user;
      const book = Book.create({
        name,
        imageUrl: image ?? null,
        fileUrl: fileData.location,
        link,
        content,
        user,
      });
      const category = await Category.getUserCategoryById(user.id, categoryId);
      if (!category) {
        throw new ApiError("category not found", 400);
      }
      book.category = category;
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
    const { name, image, fileUrl, link, content, categoryId } = req.body;
    const book = await Book.getUserBookById(user.id, id);
    book.name = name;
    if (image) book.imageUrl = image;
    if (fileUrl) book.fileUrl = fileUrl;
    if (link) book.link = link;
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

export const deleteBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const book = await Book.delete(id);
    res.status(200).json({ message: "delete success" });
  }
);
