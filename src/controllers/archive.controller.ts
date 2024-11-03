import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Chatbot } from "../models/ChatBot.model";
import { getDateWithoutTime } from "../utils/getDateWithoutTime";
import { ChatbotsQuery } from "../utils/validators/ChatbotValidator";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { Quiz } from "../models/Quiz.model";

const getArchiveDates = () => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  const previousDate = new Date(yesterdayDate);
  previousDate.setDate(yesterdayDate.getDate() - 1);

  return {
    todayDate: getDateWithoutTime(todayDate),
    yesterdayDate: getDateWithoutTime(yesterdayDate),
    previousDate: getDateWithoutTime(previousDate),
  };
};

export const getArchiveChatbots = asyncHandler(
  async (
    req: Request<{}, {}, {}, ChatbotsQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, page, pageSize, categoryId, bookId } = req.query;
    const user = req.user;
    const { take, skip } = getPaginationData({ page, pageSize });
    const { todayDate, yesterdayDate, previousDate } = getArchiveDates();

    const todayChatbots = await Chatbot.getChatbotQuerable({
      userId: user.id,
      name,
      fromDate: todayDate,
      toDate: todayDate,
      categoryId,
      bookId,
    }).getMany();

    const yasterdayChatbots = await Chatbot.getChatbotQuerable({
      userId: user.id,
      name,
      fromDate: yesterdayDate,
      toDate: yesterdayDate,
      categoryId,
      bookId,
    }).getMany();

    const previousChatbotsQuerable = Chatbot.getChatbotQuerable({
      userId: user.id,
      name,
      toDate: previousDate,
      categoryId,
      bookId,
    });

    const previousChatbotsCount = await previousChatbotsQuerable.getCount();
    const previousChatbots = await previousChatbotsQuerable
      .skip(skip)
      .take(take)
      .getMany();

    res.status(200).json({
      todayChatbots,
      yasterdayChatbots,
      previousChatbots: new GenericResponse<Chatbot>(
        page,
        take,
        previousChatbotsCount,
        previousChatbots
      ),
    });
  }
);

export const getArchiveQuizes = asyncHandler(
  async (
    req: Request<{}, {}, {}, ChatbotsQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, page, pageSize, categoryId, bookId } = req.query;
    const user = req.user;
    const { take, skip } = getPaginationData({ page, pageSize });
    const { todayDate, yesterdayDate, previousDate } = getArchiveDates();

    const todayQuizes = await Quiz.getQuizQuerable({
      userId: user.id,
      name,
      fromDate: todayDate,
      toDate: todayDate,
      categoryId,
      bookId,
    }).getMany();

    const yasterdayQuizes = await Quiz.getQuizQuerable({
      userId: user.id,
      name,
      fromDate: yesterdayDate,
      toDate: yesterdayDate,
      categoryId,
      bookId,
    }).getMany();

    const previousQuizesQuerable = Quiz.getQuizQuerable({
      userId: user.id,
      name,
      toDate: previousDate,
      categoryId,
      bookId,
    });

    const previousQuizesCount = await previousQuizesQuerable.getCount();
    const previousQuizes = await previousQuizesQuerable
      .skip(skip)
      .take(take)
      .getMany();

    res.status(200).json({
      todayQuizes,
      yasterdayQuizes,
      previousQuizes: new GenericResponse<Quiz>(
        page,
        take,
        previousQuizesCount,
        previousQuizes
      ),
    });
  }
);
