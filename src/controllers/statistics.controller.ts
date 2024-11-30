import { NextFunction, Response, Request } from "express";
import expressAsync from "express-async-handler";
import { getTodayDates } from "../utils/Dates";
import { User } from "../models/User.model";

export const getHomeStatistcs = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { todayEnd, todayStart } = getTodayDates();

    const queryResult = await User.getRepository()
      .createQueryBuilder("user")
      .leftJoin("user.books", "book")
      .leftJoin("user.quizes", "quize")
      .select("user.id", "userId")
      .addSelect("user.booksGoal", "booksGoal")
      .addSelect("user.examsGoal", "examsGoal")
      .addSelect("COUNT(DISTINCT book.id)", "booksCount")
      .addSelect("COUNT(DISTINCT quize.id)", "examsCount")
      .addSelect(
        `CASE 
            WHEN user.booksGoal > 0 THEN (COUNT(DISTINCT book.id) / user.booksGoal) * 100
            ELSE 0
        END`,
        "booksPercentage"
      )
      .addSelect(
        `CASE 
            WHEN user.examsGoal > 0 THEN (COUNT(DISTINCT quize.id) / user.examsGoal) * 100
            ELSE 0
        END`,
        "examsPercentage"
      )
      .where("user.id = :userId", { userId: user.id })
      .andWhere("book.createdAt BETWEEN :todayStart AND :todayEnd", {
        todayStart,
        todayEnd,
      })
      .andWhere("quize.createdAt BETWEEN :todayStart AND :todayEnd", {
        todayStart,
        todayEnd,
      })
      .getRawOne();

    res.status(200).json({
      booksPercentage: parseFloat(queryResult.booksPercentage),
      examsPercentage: parseFloat(queryResult.examsPercentage),
      booksCount: parseInt(queryResult.booksCount, 10),
      examsCount: parseInt(queryResult.examsCount, 10),
      booksGoal: parseInt(queryResult.booksGoal, 10),
      examsGoal: parseInt(queryResult.examsGoal, 10),
    });
  }
);
