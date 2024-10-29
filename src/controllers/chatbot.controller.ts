import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Chatbot } from "../models/ChatBot.model";
import { Equal, In } from "typeorm";
import ApiError from "../utils/ApiError";
import { ChatbotMessages } from "../models/ChatBotMessages.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { Book } from "../models/Books.model";

export const getChatbots = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { page, pageSize } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const condition = {
      user: {
        id: user.id,
      },
    };

    const [chatbots, count] = await Chatbot.findAndCount({
      where: condition,
      relations: ["books"],
      take,
      skip,
    });

    res
      .status(200)
      .json(new GenericResponse<Chatbot>(Number(page), take, count, chatbots));
  }
);

export const getChatbotById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id } = req.params;
    const chatbot = await Chatbot.getUserChatbotById(user.id, id);
    res.status(200).json({ chatbot });
  }
);

export const addChatbots = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, booksIds } = req.body;
    const user = req.user;
    const books = await Book.find({
      where: {
        user: {
          id: user.id,
        },
        id: In(booksIds),
      },
    });
    const chatbot = await Chatbot.create({
      name,
      user,
      books,
    });

    await chatbot.save();
    res.status(200).json({ chatbot });
  }
);

export const updateChatbot = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, booksIds } = req.body;
    const { id } = req.params;
    const user = req.user;
    const chatbot = await Chatbot.getUserChatbotById(user.id, id);
    if (!chatbot) {
      next(new ApiError("chatbot not found", 404));
    }
    const books = await Book.find({
      where: {
        user: {
          id: user.id,
        },
        id: In(booksIds),
      },
    });
    chatbot.name = name;
    chatbot.books = books;
    await chatbot.save();
    res.status(200).json({ chatbot });
  }
);

export const deleteChatbot = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id } = req.params;
    const chatbot = await Chatbot.getUserChatbotById(user.id, id);

    if (!chatbot) {
      next(new ApiError("chatbot not found", 404));
    }
    await chatbot.remove();
    res.status(200).json({ message: "delete success" });
  }
);

export const getChatbotMessages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize } = req.query;
    const user = req.user;
    const { id } = req.params;
    const { take, skip } = getPaginationData({ page, pageSize });
    const chatbot = await Chatbot.findOne({
      where: {
        id: Equal(id),
        user: {
          id: user.id,
        },
      },
    });
    if (!chatbot) {
      next(new ApiError("chatbot not found", 404));
    }
    const condition = {
      chatbot: {
        id: Equal(id),
      },
    };
    const [messages, count] = await ChatbotMessages.findAndCount({
      where: condition,
      take,
      skip,
      relations: {
        bookmark: true,
      },
    });

    res
      .status(200)
      .json(
        new GenericResponse<ChatbotMessages>(
          Number(page),
          take,
          count,
          messages
        )
      );
  }
);

export const addMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { message, recordUrl, fileUrl, from } = req.body;
    const chatbot = await Chatbot.findOne({
      where: {
        id: Equal(id),
        user: {
          id: user.id,
        },
      },
    });
    if (!chatbot) {
      next(new ApiError("chatbot not found", 404));
    }
    const newMessage = ChatbotMessages.create({
      message,
      recordUrl,
      fileUrl,
      chatbot,
      from,
    });
    await newMessage.save();
    res.status(201).json({ message: newMessage });
  }
);

export const addBooksToChatbot = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { booksIds } = req.body;
    const user = req.user;
    const chatbot = await Chatbot.getUserChatbotById(user.id, id);
    if (!chatbot) {
      next(new ApiError("chatbot not found", 404));
    }
    const books = await Book.find({
      where: {
        user: {
          id: user.id,
        },
        id: In(booksIds),
      },
    });
    chatbot.books = [...chatbot.books, ...books];
    await chatbot.save();
    res.status(200).json({ chatbot });
  }
);
