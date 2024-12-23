import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Bookmark } from "../models/Bookmarks.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { ChatbotMessages } from "../models/ChatBotMessages.model";
import ApiError from "../utils/ApiError";
import { Question } from "../models/Questions.model";
import { User } from "../models/User.model";
import { FindOptionsWhere, In } from "typeorm";
import { TFunction } from "i18next";

export const getBookmarks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { page, pageSize, bookId, chatbotId, quizId } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const quereable = await Bookmark.createQueryBuilder("bookmark")
      .leftJoin("bookmark.user", "user")
      .leftJoinAndSelect("bookmark.chatbotMessage", "chatbotMessage")
      .leftJoin("chatbotMessage.chatbot", "chatbot")
      .leftJoin("chatbot.books", "chatBotbook")
      .leftJoinAndSelect("bookmark.question", "question")
      .leftJoin("question.quiz", "quiz")
      .leftJoin("quiz.books", "quizBook")
      .where("user.id = :userId", { userId: user.id });

    if (bookId) {
      quereable.andWhere(
        "(chatBotbook.id = :bookId OR quizBook.id = :bookId)",
        { bookId }
      );
    }
    if (chatbotId) {
      quereable.andWhere("chatbot.id = :chatbotId", { chatbotId });
    }
    if (quizId) {
      quereable.andWhere("quiz.id = :quizId", { quizId });
    }

    const [bookmarks, count] = await quereable
      .skip(skip)
      .take(take)
      .getManyAndCount();

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

    await toggleBookmark({
      chatbotMessageId,
      questionId,
      user,
      translate: req.t,
    });

    res.status(200).json({ message: req.t("toggle_bookmark_success") });
  }
);

export const toggleBookmark = async ({
  chatbotMessageId,
  questionId,
  user,
  translate,
}: {
  chatbotMessageId: string;
  questionId: string;
  user: User;
  translate: TFunction;
}) => {
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
      throw new ApiError(translate("chatbot_message_not_found"), 400);
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
      throw new ApiError(translate("question_not_found"), 400);
    }
    await handleQuestionBookmark(question, user);
  }
};

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
