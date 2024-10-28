import { Application } from "express";
import AuthRouter from "./authentication.router";
import categoriesRouter from "./categories.router";
import booksRouter from "./books.router";
import profileRouter from "./profile.router";
import chatbotRouter from "./chatbot.router";
import quizesRouter from "./quizes.router";

import { protect } from "../controllers/authentication.controller";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/categories", protect, categoriesRouter);
    app.use("/api/v1/books", protect, booksRouter);
    app.use("/api/v1/profile", protect, profileRouter);
    app.use("/api/v1/chatbots", protect, chatbotRouter);
    app.use("/api/v1/quizes", protect, quizesRouter);
  }
}
