import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Book } from "../models/Books.model";
import { FindOptionsWhere, ILike, IsNull, Not } from "typeorm";
import { Category } from "../models/Categories.model";
import { GenericResponse } from "../utils/GenericResponse";
import { getPaginationData } from "../utils/getPaginationData";
import ApiError from "../utils/ApiError";

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
    const { name, imageUrl, fileUrl, link, content, categoryId } = req.body;
    const user = req.user;
    const book = Book.create({ name, imageUrl, fileUrl, link, content, user });
    const category = await Category.getUserCategoryById(user.id, categoryId);
    if (!category) {
      return next(new ApiError("category not found", 400));
    }
    book.category = category;
    await book.save();
    delete book.user;
    delete book.category;
    res.status(201).json({ book });
  }
);

export const updateBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { name, imageUrl, fileUrl, link, content, categoryId } = req.body;
    const book = await Book.getUserBookById(user.id, id);
    book.name = name;
    book.imageUrl = imageUrl;
    book.fileUrl = fileUrl;
    book.link = link;
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
