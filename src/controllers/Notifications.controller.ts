import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { getPaginationData } from "../utils/getPaginationData";
import { Notification, NotificationType } from "../models/Notification.model";
import { Equal, FindOptionsWhere } from "typeorm";
import { GenericResponse } from "../utils/GenericResponse";
import { BaseQuery } from "../utils/validators/BaseQuery";

interface INotificationQuery extends BaseQuery {
  type: NotificationType;
}
export const getNotifications = asyncHandler(
  async (
    req: Request<{}, {}, {}, INotificationQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const { page, pageSize, type } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let query: FindOptionsWhere<Notification> = {
      user: {
        id: user.id,
      },
    };
    if (type) {
      query = { ...query, type };
    }

    const [notifications, count] = await Notification.findAndCount({
      where: query,
      skip,
      take,
      order: {
        createdAt: "DESC",
      },
    });
    res
      .status(200)
      .json(
        new GenericResponse<Notification>(
          Number(page),
          take,
          count,
          notifications
        )
      );
  }
);
