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
        email: true,
        username: true,
        phoneNumber: true,
        imageUrl: true,
        facebookId: true,
        googleId: true,
        twitterId: true,
      },
      take,
      skip,
    });
    // users.map("")
    res
      .status(200)
      .json(new GenericResponse<User>(Number(page), take, count, users));
  }
);

export const addFcmToUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    user.fcm = req.body.fcm;
    await user.save();
    res.status(200).json({ user });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    await User.delete(user.id);
    // await user.save();
    res.json({ message: "delete user success " });
  }
);
