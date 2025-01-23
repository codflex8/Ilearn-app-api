import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { AppLinks } from "../../models/AppLinks.model";

export const addAppLinks = expressAsyncHandler(
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
