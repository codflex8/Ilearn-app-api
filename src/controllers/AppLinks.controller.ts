import expressAsync from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { AppLinks } from "../models/AppLinks.model";

export const getAppLinks = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const appLinks = await AppLinks.findOne({ where: {} });
    res.status(200).json({ appLinks });
  }
);

export const addAppLinks = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { androidLink, appleLink } = req.body;
    let termsAndPolicy: AppLinks = await AppLinks.findOne({
      where: {},
    });
    if (!termsAndPolicy) {
      termsAndPolicy = new AppLinks();
    }
    termsAndPolicy.androidLink = androidLink;
    termsAndPolicy.appleLink = appleLink;
    await termsAndPolicy.save();
    res.status(200).json({ termsAndPolicy });
  }
);