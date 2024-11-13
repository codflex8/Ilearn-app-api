import { Server } from "socket.io";
import { User } from "../models/User.model";

const WEBSOCKET_CORS = {
  origin: "*",
  // methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;
  private static users: User[] = [];

  constructor(httpServer) {
    super(httpServer, {
      cors: {
        origin: "*",
        credentials: true,
      },
      transports: ["websocket", "polling"],
      allowEIO3: true,
    });
  }

  public static getInstance(httpServer?): Websocket {
    if (!this.io) {
      this.io = new Websocket(httpServer);
    }

    return this.io;
  }

  public static getUsers(): User[] {
    return this.users;
  }

  public static addUser(user: User) {
    if (!this.users.find((u) => u.id == user?.id)) {
      this.users = [...this.users, user];
    }
  }
}

export default Websocket;
