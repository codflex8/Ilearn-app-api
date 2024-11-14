import { Server } from "socket.io";
import { User } from "../models/User.model";

const WEBSOCKET_CORS = {
  origin: "*",
  // methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;
  private static users: User[] = [];
  private static roomUsers: Record<string, Array<User>> = {};

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

  public static getroomUsers(roomId: string): User[] {
    return this.roomUsers[roomId] ?? [];
  }

  public static addUserToRoom(roomId: string, user: User) {
    if (
      !this.roomUsers[roomId]?.find((u) => u.id == user?.id) ||
      !this.roomUsers[roomId]
    ) {
      const newRoomUsers = [...(this.roomUsers[roomId] ?? []), user];
      this.roomUsers = { ...this.roomUsers, [roomId]: newRoomUsers };
    }
  }

  public static removeUserFromRoom(roomId: string, user: User) {
    const newRoomUsers = this.roomUsers[roomId].filter((u) => u.id !== user.id);
    this.roomUsers = { ...this.roomUsers, [roomId]: newRoomUsers };
  }

  public static getUsers(): User[] {
    return this.users;
  }

  public static addUser(user: User) {
    if (!this.users.find((u) => u.id == user?.id)) {
      this.users = [...this.users, user];
    }
  }

  public static removeUser(user: User) {
    this.users = this.users?.filter((u) => u.id !== user.id);
  }
}

export default Websocket;
