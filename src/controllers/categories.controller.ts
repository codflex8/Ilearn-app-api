import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Category } from "../models/Categories.model";
import { Equal, FindOptionsWhere, And, ILike } from "typeorm";
import { Book } from "../models/Books.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import path from "path";

export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { name } = req.query;
    const { page, pageSize } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let query: FindOptionsWhere<Category> = {
      user: {
        id: Equal(user.id),
      },
    };
    if (name) {
      query = { ...query, name: ILike(`%${name}%`) };
    }
    const [categories, count] = await Category.findAndCount({
      where: query,
      skip,
      take,
      order: {
        createdAt: "DESC",
      },
    });
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
    const { name, imageUrl } = req.body;
    const user = req.user;
    const updateCategory = await Category.getUserCategoryById(user.id, id);
    updateCategory.name = name;
    updateCategory.imageUrl = imageUrl;
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
