import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getPaginationData } from "../../utils/getPaginationData";
import { GenericResponse } from "../../utils/GenericResponse";
import { User } from "../../models/User.model";
import ApiError from "../../utils/ApiError";
import { UserStatus } from "../../utils/validators/AuthValidator";

export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, username, status } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const queryBuilder = User.createQueryBuilder("user");

    if (username) {
      queryBuilder.andWhere("LOWER(user.username) LIKE :username", {
        username: `%${username.toString().toLowerCase()}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere("user.status = :status", {
        status,
      });
    }

    queryBuilder.skip(skip).take(take).orderBy("user.createdAt", "DESC");

    const [users, count] = await queryBuilder.getManyAndCount();
    res
      .status(200)
      .json(new GenericResponse<User>(Number(page), take, count, users));
  }
);

export const toggleUserStatus = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findOneBy({ id });
    if (!user) throw new ApiError(req.t("not-found"), 400);
    user.status =
      user.status === UserStatus.active
        ? UserStatus.unactive
        : UserStatus.active;
    await user.save();
    res.status(200).json({ message: "toggle status success" });
  }
);

export const removeUserStatus = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findOneBy({ id });
    if (!user) throw new ApiError(req.t("not-found"), 400);
    await user.remove();
    res.status(200).json({ message: "toggle status success" });
  }
);
