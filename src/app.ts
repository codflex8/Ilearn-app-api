import express, { Application, NextFunction, Request, Response } from "express";
import { dataSource } from "./models/dataSource";
import Routes from "./routes";
import cors from "cors";
import morgan from "morgan";
import { globalError } from "./middleware/ErrorMiddleware";
import ApiError from "./utils/ApiError";
import dotenv from "dotenv";
import path from "path";
import { httpLogger } from "./utils/logger";

export default class AppServer {
  constructor(app: Application) {
    this.connectDatabase();
    this.config(app);
  }

  private config(app: Application) {
    dotenv.config();
    app.use(cors());
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));
    app.use((req: Request, res: Response, next: NextFunction) => {
      httpLogger.info("new request", {
        path: req.path,
        body: req.body,
        // headers: req.headers,
        query: req.query,
      });

      next();
    });
    // app.use(morgan());
    app.use("/public", express.static(path.join(__dirname, "public")));
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
      return res.send("hello worldddd");
    });

    new Routes(app);

    app.all("*", (req, res, next) => {
      next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
    });
    app.use(globalError);
  }

  private connectDatabase() {
    dataSource
      .initialize()
      .then(() => {
        console.log("data base connected");
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error(err);
      });
  }
}
