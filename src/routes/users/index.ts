import { Application } from "express";
import AuthRouter from "./authentication.router";
import categoriesRouter from "./categories.router";
import booksRouter from "./books.router";
import profileRouter from "./profile.router";
import chatbotRouter from "./chatbot.router";
import quizesRouter from "./quizes.router";
import bookmarksRouter from "./bookmarks.router";
import homeRouter from "./home.router";
import archiveRouter from "./archive.router";
import groupChatRouter from "./groupsChat.router";
import usersRouter from "./users.router";
import statisticsRouter from "./statistics.router";
import termsAndPolicyRouter from "./termsAndPolicy.router";
import appLinksRouter from "./appLinks.router";
import notificationRouter from "./notifications.router";
import appVersionsRouter from "./appVersions.router";
import { protect } from "../../controllers/users/authentication.controller";
import { shareApp } from "../../controllers/users/GroupsChat.controller";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/app-links", appLinksRouter);
    app.use("/api/v1/app-versions", appVersionsRouter);
    app.post("/api/v1/share-app", protect, shareApp);
    app.use("/api/v1", protect, homeRouter);
    app.use("/api/v1", protect, usersRouter);
    app.use("/api/v1/archive", protect, archiveRouter);
    app.use("/api/v1/categories", protect, categoriesRouter);
    app.use("/api/v1/books", protect, booksRouter);
    app.use("/api/v1/profile", protect, profileRouter);
    app.use("/api/v1/chatbots", protect, chatbotRouter);
    app.use("/api/v1/quizes", protect, quizesRouter);
    app.use("/api/v1/bookmarks", protect, bookmarksRouter);
    app.use("/api/v1/groupschat", protect, groupChatRouter);
    app.use("/api/v1/statistics", protect, statisticsRouter);
    app.use("/api/v1/notifications", protect, notificationRouter);
    app.use("/api/v1", protect, termsAndPolicyRouter);
  }
}
