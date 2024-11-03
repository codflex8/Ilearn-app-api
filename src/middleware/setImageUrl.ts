import { NextFunction, Request, Response } from "express";
import { Multer } from "multer";
import path from "path";

export const setImageUrl =
  (propertyName: string = "imageUrl") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body[propertyName] = path.join("public/images", req.file.filename);
    }
    if (req.files && !Array.isArray(req.files)) {
      Object.entries(req.files).map(([key, field]) => {
        req.body[key] = path.join("public/images", field[0].filename);
      });
    }
    next();
  };
