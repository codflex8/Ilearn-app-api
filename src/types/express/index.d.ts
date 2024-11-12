import express from "express";
import { User } from "../../models/User.model";

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
  }
}
