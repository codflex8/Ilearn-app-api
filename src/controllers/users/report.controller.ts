import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Report } from "../../models/report.model";
import { GroupsChat } from "../../models/GroupsChat.model";
import ApiError from "../../utils/ApiError";

export const addReport = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const group = await GroupsChat.findOne({
      where: {
        id,
      },
    });
    if (!group) {
      throw new ApiError(req.t("group_chat_not_found"), 400);
    }
    const report = Report.create({
      user,
      group,
    });
    await report.save();
    console.log(report);
    res.json({ message: req.t("success") });
  }
);

export const getReports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;

    const reports = await Report.find({
      where: {
        user: {
          id: user.id,
        },
        group: {
          id,
        },
      },
      relations: ["group", "user"],
    });
    res.json({ reports });
  }
);
