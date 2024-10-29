import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Category } from "../models/Categories.model";
import { GenericResponse } from "../utils/GenericResponse";
import { Book } from "../models/Books.model";
import { Chatbot } from "../models/ChatBot.model";
import { Quiz } from "../models/Quiz.model";
import { Bookmark } from "../models/Bookmarks.model";

export const home = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const [categories, categoriesCount] = await Category.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: 10,
      order: {
        createdAt: "DESC",
      },
    });

    const [books, booksCount] = await Book.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: 10,
      order: {
        createdAt: "DESC",
      },
    });
    res.status(200).json({
      categories: new GenericResponse<Category>(
        Number(1),
        10,
        categoriesCount,
        categories
      ),
      books: new GenericResponse<Book>(Number(1), 10, booksCount, books),
    });
  }
);

export const archive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const [chatbots, chatbotsCount] = await Chatbot.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: 10,
      order: {
        createdAt: "DESC",
      },
    });

    const [quizes, quizesCount] = await Quiz.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: 10,
      order: {
        createdAt: "DESC",
      },
    });

    const [bookmarks, bookmarksCount] = await Bookmark.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: 10,
      relations: {
        question: true,
        chatbotMessage: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    res.status(200).json({
      categories: new GenericResponse<Chatbot>(
        Number(1),
        10,
        chatbotsCount,
        chatbots
      ),
      books: new GenericResponse<Quiz>(Number(1), 10, quizesCount, quizes),
      bookmarks: new GenericResponse<Bookmark>(
        Number(1),
        10,
        bookmarksCount,
        bookmarks
      ),
    });
  }
);
