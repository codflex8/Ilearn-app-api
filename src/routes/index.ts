import { Application } from "express";
import AuthRouter from "./authentication.router";
export default class Routes {
  constructor(app: Application) {
    app.use("/api/v1/auth", AuthRouter);
  }
}
