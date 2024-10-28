import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Book } from "../models/Books.model";
import { Equal, In } from "typeorm";
import { Category } from "../models/Categories.model";
import { GenericResponse } from "../utils/GenericResponse";
import { getPaginationData } from "../utils/getPaginationData";

export const getBooks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, name } = req.query;
    const user = req.user;
    const { page, pageSize } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let querable = Book.getRepository()
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.categories", "category")
      .innerJoin("book.user", "user")
      .where("user.id = :id", { id: user.id });

    if (name) {
      querable = querable.andWhere("LOWER(book.name) LIKE LOWER(:name) ", {
        name: `%${name}%`,
      });
    }
    if (categoryId) {
      querable = querable.andWhere("category.id = :categoryId", {
        categoryId: categoryId,
      });
    }
    const books = await querable
      .skip(skip)
      .take(take)
      .orderBy("book.createdAt", "DESC")
      .getMany();
    const count = await querable.getCount();
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
    if (!book) {
      res.send(203).json({ message: "no content" });
      return;
    }
    res.status(200).json({ book });
  }
);

export const addBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, imageUrl, fileUrl, link, content, categoriesIds } = req.body;
    const user = req.user;
    const categories = await Category.find({
      where: {
        id: In(categoriesIds),
      },
    });
    const book = Book.create({ name, imageUrl, fileUrl, link, content, user });
    // const category = await Category.findOne({
    //   where: {
    //     id: Equal(categoryId),
    //     user: {
    //       id: Equal(user.id),
    //     },
    //   },
    // });
    // if (category) {
    //   book.categories = [category];
    // }
    book.categories = categories;
    await book.save();
    res.status(201).json({ book });
  }
);

export const updateBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { name, imageUrl, fileUrl, link, content } = req.body;
    const book = await Book.getUserBookById(user.id, id);
    book.name = name;
    book.imageUrl = imageUrl;
    book.fileUrl = fileUrl;
    book.link = link;
    book.content = content;
    await book.save();
    res.status(200).json({ book });
  }
);

export const deleteBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const book = await Book.delete(id);
    res.status(200).json({ book });
  }
);
