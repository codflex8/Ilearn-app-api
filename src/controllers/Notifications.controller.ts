import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { getPaginationData } from "../utils/getPaginationData";
import { Notification, NotificationType } from "../models/Notification.model";
import { FindOptionsWhere, In } from "typeorm";
import { GenericResponse } from "../utils/GenericResponse";
import { BaseQuery } from "../utils/validators/BaseQuery";
import Websocket from "../websocket/websocket";

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
    const querable = Notification.getRepository()
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.user", "user")
      .leftJoinAndSelect("notification.group", "group")
      .leftJoinAndSelect("notification.fromUser", "fromUser")
      .where("user.id = :userId", { userId: user.id });

    if (type) {
      querable.andWhere("notification.type");
    }
    const [notifications, count] = await querable
      .orderBy("user.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .select("notification")
      .addSelect("user")
      .addSelect("group")
      .addSelect([
        "fromUser.id",
        "fromUser.username",
        "fromUser.email",
        "fromUser.imageUrl",
      ])
      .getManyAndCount();

    // let query: FindOptionsWhere<Notification> = {
    //   user: {
    //     id: user.id,
    //   },
    // };
    // if (type) {
    //   query = { ...query, type };
    // }

    // const [notifications, count] = await Notification.findAndCount({
    //   where: query,
    //   skip,
    //   take,
    //   relations: {
    //     user: true,
    //     group: true,
    //     fromUser: true,
    //   },
    //   order: {
    //     createdAt: "DESC",
    //   },
    // });
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
    const notificationsIds = notifications.map((notif) => notif.id);
    await Notification.update(
      {
        id: In(notificationsIds),
      },
      {
        seen: true,
      }
    );
    Websocket.sendNotificationsCount(user.id);
  }
);
