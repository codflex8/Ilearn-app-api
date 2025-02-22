import express, { Application, NextFunction, Request, Response } from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { dataSource } from "./models/dataSource";
import Routes from "./routes/users";
import cors from "cors";
import { globalError } from "./middleware/ErrorMiddleware";
import ApiError from "./utils/ApiError";
import dotenv from "dotenv";
import path from "path";
import { httpLogger } from "./utils/logger";
import DashboardRoutes from "./routes/dashboard";

export default class AppServer {
  constructor(app: Application) {
    this.connectDatabase();
    this.config(app);
  }

  private config(app: Application) {
    app.use("/public", express.static(path.join(__dirname, "public")));

    i18next
      .use(Backend) // Connects the file system backend
      .use(middleware.LanguageDetector) // Enables automatic language detection
      .init({
        backend: {
          loadPath: path.join(
            process.cwd(),
            "src/locales",
            "{{lng}}",
            "{{ns}}.json"
          ), // Path to translation files
        },
        detection: {
          order: ["header"], // Detect language from HTTP headers
          caches: false, // Disable caching if you don't want cookies or query strings involved
        },
        fallbackLng: "en", // Default language when no language is detected
        preload: ["en", "ar"], // Preload these languages at startup
      });
    dotenv.config();
    app.use(middleware.handle(i18next));
    app.use(cors({ origin: "*" }));
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));
    app.use((req: Request, res: Response, next: NextFunction) => {
      httpLogger.info("new request", {
        path: req.path,
        body: req.body,
        headers: req.headers,
        query: req.query,
      });

      next();
    });
    // app.use(morgan());
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
      return res.send("hello worldddd");
    });

    new DashboardRoutes(app);
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
        console.error(err);
        throw new Error(err);
      });
  }
}
