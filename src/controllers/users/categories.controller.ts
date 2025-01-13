import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Category } from "../../models/Categories.model";
import { getPaginationData } from "../../utils/getPaginationData";
import { GenericResponse } from "../../utils/GenericResponse";
import { Brackets } from "typeorm";

export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { name, forArchive } = req.query;
    const { page, pageSize } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const querable = Category.createQueryBuilder("category")
      .leftJoin("category.user", "user")
      .leftJoinAndSelect("category.books", "book")
      .leftJoin("book.quizes", "quiz")
      .leftJoin("book.chatbots", "chatbot")
      .where("user.id = :userId", { userId: user.id });

    if (name) {
      querable.andWhere("LOWER(category.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }

    if (forArchive) {
      querable.andWhere(
        new Brackets((db) => {
          db.where("quiz.id IS NOT NULL").orWhere("chatbot.id IS NOT NULL");
        })
      );
    }

    const [categories, count] = await querable
      .orderBy("category.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    res
      .status(200)
      .json(
        new GenericResponse<Category>(Number(page), take, count, categories)
      );
  }
);

export const getCategoryByID = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const category = await Category.getUserCategoryById(user.id, id);
    res.status(200).json({ category });
  }
);

export const addCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, image } = req.body;
    const user = req.user;
    const newCategory = Category.create({ name, imageUrl: image, user });
    await newCategory.save();
    delete newCategory.user;
    res.status(201).json({ category: newCategory });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, image } = req.body;
    const user = req.user;
    const updateCategory = await Category.getUserCategoryById(user.id, id);
    updateCategory.name = name;
    if (image) updateCategory.imageUrl = image;
    await updateCategory.save();
    res.status(200).json({ category: updateCategory });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const category = await Category.getUserCategoryById(user.id, id);
    await category?.remove();
    res.status(200).json({ message: req.t("delete_success") });
  }
);
