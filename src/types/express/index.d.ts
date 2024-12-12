import express from "express";
import { User } from "../../models/User.model";
import { TFunction } from "i18next";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user: User;
    t: TFunction;
  }
}
