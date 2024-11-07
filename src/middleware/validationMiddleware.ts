import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodType } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any> | ZodType<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((issue: any) => `${issue.path.join(".")} is ${issue.message}`)
          .join(", ");
        res.status(StatusCodes.BAD_REQUEST).json({ message: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
