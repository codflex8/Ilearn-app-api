import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Bookmark } from "../models/Bookmarks.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ChatbotMessages } from "../models/ChatBotMessages.model";
import ApiError from "../utils/ApiError";
import { Question } from "../models/Questions.model";
import { User } from "../models/User.model";
import { FindOneOptions, FindOptions, FindOptionsWhere, In } from "typeorm";

export const getBookmarks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { page, pageSize, bookId, chatbotId, quizId } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let conditions: FindOptionsWhere<Bookmark> = {
      user: {
        id: user.id,
      },
    };
    if (bookId) {
      conditions = {
        ...conditions,
        question: {
          quiz: {
            books: {
              id: In([bookId]),
            },
          },
        },
      };
    }
    if (chatbotId) {
      conditions = {
        ...conditions,
        chatbotMessage: {
          chatbot: {
            id: In([chatbotId]),
          },
        },
      };
    }

    if (quizId) {
      conditions = {
        ...conditions,
        question: {
          quiz: {
            id: In([quizId]),
          },
        },
      };
    }

    const [bookmarks, count] = await Bookmark.findAndCount({
      where: conditions,
      relations: {
        chatbotMessage: true,
        question: true,
      },
      skip,
      take,
    });
    res
      .status(200)
      .json(
        new GenericResponse<Bookmark>(Number(page), take, count, bookmarks)
      );
  }
);

export const addBookmark = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatbotMessageId, questionId } = req.body;
    const user = req.user;

    if (chatbotMessageId) {
      const chatbotMessage = await ChatbotMessages.findOne({
        where: {
          id: chatbotMessageId,
          chatbot: {
            user: {
              id: user.id,
            },
          },
        },
      });
      if (!chatbotMessage) {
        return next(new ApiError("chatbot message not found", 400));
      }
      handleChatbotMessagesBookmark(chatbotMessage, user);
    }

    if (questionId) {
      const question = await Question.findOne({
        where: {
          id: questionId,
          quiz: {
            user: {
              id: user.id,
            },
          },
        },
      });
      if (!question) {
        return next(new ApiError("question not found", 400));
      }
      await handleQuestionBookmark(question, user);
    }
    res.status(200).json({ message: "toggle bookmark Success" });
  }
);

const handleChatbotMessagesBookmark = async (
  chatbotMessage: ChatbotMessages,
  user: User
) => {
  const bookmark = await Bookmark.findOne({
    where: {
      chatbotMessage: {
        id: chatbotMessage.id,
      },
      user: {
        id: user.id,
      },
    },
  });
  if (bookmark) {
    await bookmark.remove();
    return bookmark;
  } else {
    const newBookmark = await Bookmark.create();
    newBookmark.user = user;
    newBookmark.chatbotMessage = chatbotMessage;
    await newBookmark.save();
    return newBookmark;
  }
};

const handleQuestionBookmark = async (question: Question, user: User) => {
  const bookmark = await Bookmark.findOne({
    where: {
      question: { id: question.id },
      user: {
        id: user.id,
      },
    },
  });
  if (bookmark) {
    await bookmark.remove();
    return bookmark;
  } else {
    const newBookmark = await Bookmark.create();
    newBookmark.user = user;
    newBookmark.question = question;
    await newBookmark.save();
    return newBookmark;
  }
};
