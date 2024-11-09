import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.model";
import { getPaginationData } from "../utils/getPaginationData";
import { FindOptionsWhere, ILike } from "typeorm";
import { GenericResponse } from "../utils/GenericResponse";

export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, username } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let condition: FindOptionsWhere<User> = {};
    if (username) {
      condition = { ...condition, username: ILike(`%${username}%`) };
    }
    const [users, count] = await User.findAndCount({
      where: condition,
      select: {
        id: true,
        username: true,
        phoneNumber: true,
      },
      take,
      skip,
    });
    res
      .status(200)
      .json(new GenericResponse<User>(Number(page), take, count, users));
  }
);
