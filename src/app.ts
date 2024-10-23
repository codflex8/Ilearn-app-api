import express, { Application, NextFunction, Request, Response } from "express";
import { dataSource } from "./models/dataSource";
import Routes from "./routes";
import cors from "cors";
import morgan from "morgan";
import { globalError } from "./middleware/ErrorMiddleware";
import ApiError from "./utils/ApiError";
import dotenv from "dotenv";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
  }

  private config(app: Application) {
    dotenv.config();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan());
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
      return res.send("hello world");
    });

    new Routes(app);

    app.all("*", (req, res, next) => {
      next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
    });
    app.use(globalError);
  }

  private syncDatabase() {
    dataSource
      .initialize()
      .then(() => {
        console.log("connected to db success");
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error(err);
      });
  }
}
