import { Server } from "socket.io";
import { User } from "../models/User.model";

const WEBSOCKET_CORS = {
  origin: "*",
  // methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;
  private static users: User[] = [];
  private static rooms: Record<string, Array<User>> = {};

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

  public static getActiveRoomsIds() {
    return Object.entries(this.rooms)
      .filter(([roomId, users]) => users.length)
      .map(([roomId, users]) => roomId);
  }

  public static getroomUsers(roomId: string): User[] {
    return this.rooms[roomId] ?? [];
  }

  public static getroomById(roomId: string): User[] {
    return this.rooms[roomId];
  }

  public static addUserToRoom(roomId: string, user: User) {
    if (
      !this.rooms[roomId]?.find((u) => u.id == user?.id) ||
      !this.rooms[roomId]
    ) {
      const newRoomUsers = [...(this.rooms[roomId] ?? []), user];
      this.rooms = { ...this.rooms, [roomId]: newRoomUsers };
    }
  }

  public static removeUserFromRoom(roomId: string, user: User) {
    const newRoomUsers = this.rooms[roomId].filter((u) => u.id !== user.id);
    this.rooms = { ...this.rooms, [roomId]: newRoomUsers };
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
    if (user) this.users = (this.users ?? [])?.filter((u) => u.id !== user?.id);
  }
}

export default Websocket;
