import { User } from "./src/models/User.model";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
