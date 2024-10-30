import { NextFunction, Request, Response } from "express";
import path from "path";

export const setImageUrl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    req.body.imageUrl = path.join("public/images", req.file.filename);
  }
  next();
};
