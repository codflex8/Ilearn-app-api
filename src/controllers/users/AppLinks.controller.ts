import expressAsync from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { AppLinks } from "../../models/AppLinks.model";

export const getAppLinks = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const appLinks = await AppLinks.findOne({ where: {} });
    res.status(200).json({
      appLinks: {
        androidLink: appLinks?.androidLink ?? "",
        appleLink: appLinks.appleLink ?? "",
      },
    });
  }
);
