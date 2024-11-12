import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Chatbot } from "../models/ChatBot.model";
import { Equal, In } from "typeorm";
import ApiError from "../utils/ApiError";
import { ChatbotMessages } from "../models/ChatBotMessages.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { Book } from "../models/Books.model";
import {
  ChatbotsQuery,
  IChatbotMessage,
  MessageFrom,
} from "../utils/validators/ChatbotValidator";

interface IAddMessage extends IChatbotMessage {
  recordUrl?: string;
  imageUrl?: string;
  // from: MessageFrom;
  // chatbotId: string;
  userId: string;
  errorHandler: (error: Error) => void;
}

export const getChatbots = asyncHandler(
  async (
    req: Request<{}, {}, {}, ChatbotsQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const { page, pageSize, name, bookId, categoryId, fromDate, toDate } =
      req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let querable = Chatbot.getChatbotQuerable({
      userId: user.id,
      name,
      bookId,
      categoryId,
      fromDate,
      toDate,
    });

    const chatbots = await querable.skip(skip).take(take).getMany();
    const count = await querable.getCount();

    res
      .status(200)
      .json(new GenericResponse<Chatbot>(page, take, count, chatbots));
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
      order: {
        createdAt: "DESC",
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

export const addMessageHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { message, record, image, from } = req.body;

    const newMessage = await addMessage({
      message,
      recordUrl: record,
      imageUrl: image,
      from,
      chatbotId: id,
      userId: user.id,
      errorHandler: next,
    });
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

export const addMessage = async ({
  chatbotId,
  message,
  recordUrl,
  imageUrl,
  from,
  userId,
  errorHandler,
}: IAddMessage) => {
  const chatbot = await Chatbot.findOne({
    where: {
      id: Equal(chatbotId),
      user: {
        id: userId,
      },
    },
  });
  if (!chatbot) {
    errorHandler(new ApiError("chatbot not found", 404));
  }
  const newMessage = ChatbotMessages.create({
    message,
    recordUrl,
    imageUrl,
    chatbot,
    from,
  });
  await newMessage.save();
  return newMessage;
};
