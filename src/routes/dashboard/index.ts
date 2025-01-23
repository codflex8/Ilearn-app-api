import { Application } from "express";
import authRoute from "./auth.route";
import homeRoute from "./home.route";
import usersRoute from "./users.router";
import appLinksRoute from "./appLinks.router";

import { protectAdmin } from "../../controllers/dashboard/authenticate.controller";

export default class DashboardRoutes {
  constructor(app: Application) {
    app.use("/api/v1/dashboard/auth", authRoute);
    app.use("/api/v1/dashboard/home", protectAdmin, homeRoute);
    app.use("/api/v1/dashboard/users", protectAdmin, usersRoute);
    app.use("/api/v1/dashboard/app-links", protectAdmin, appLinksRoute);
  }
}
