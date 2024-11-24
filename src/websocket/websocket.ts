import { Server } from "socket.io";
import { User } from "../models/User.model";
import { getUserRooms } from "../controllers/GroupsChat.controller";
import { GroupsChat } from "../models/GroupsChat.model";

const WEBSOCKET_CORS = {
  origin: "*",
  // methods: ["GET", "POST"],
};

interface IRooms {
  users: Array<User>;
  group: GroupsChat;
}

class Websocket extends Server {
  private static io: Websocket;
  private static users: User[] = [];
  private static rooms: Record<string, IRooms> = {};
  // private static activeGroupsChat: GroupsChat[] = [];
  private static usersSockets: Record<string, string> = {};
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
      .filter(([roomId, usersGroup]) => usersGroup.users.length)
      .map(([roomId, users]) => roomId);
  }

  public static getroomUsers(roomId: string): User[] {
    return this.rooms[roomId] ? this.rooms[roomId].users : [];
  }

  // public static getroomById(roomId: string): User[] {
  //   return this.rooms[roomId];
  // }

  // public static addActiveGroupsChat(group: GroupsChat) {
  //   if (!this.activeGroupsChat.find((g) => g.id === group.id)) {
  //     this.activeGroupsChat = [...this.activeGroupsChat, group];
  //   }
  // }

  public static addUserToRoom(group: GroupsChat, user: User) {
    if (
      !this.rooms[group.id] ||
      !this.rooms[group.id]?.users.find((u) => u.id == user?.id)
    ) {
      const newRoomUsers = [...(this.rooms[group.id]?.users ?? []), user];
      this.rooms = {
        ...this.rooms,
        [group.id]: { group, users: newRoomUsers },
      };
    }
  }

  public static removeUserFromRoom(roomId: string, user: User) {
    const newRoomUsers = this.rooms[roomId]?.users.filter(
      (u) => u.id !== user.id
    );
    this.rooms = {
      ...this.rooms,
      [roomId]: { group: this.rooms[roomId]?.group, users: newRoomUsers },
    };
  }

  public static getUsers(): User[] {
    return this.users;
  }

  public static addUser(user: User, socketId: string) {
    if (!this.users.find((u) => u.id == user?.id)) {
      this.users = [...this.users, user];
    }
    this.usersSockets = { ...this.usersSockets, [user.id]: socketId };
  }

  public static removeUser(user: User) {
    if (user) this.users = (this.users ?? [])?.filter((u) => u.id !== user?.id);
  }

  public static getUsersSocketIds(usersIds: string[]) {
    const socketsIds = [];
    usersIds.forEach((userId) => {
      if (this.usersSockets[userId]) {
        socketsIds.push(this.usersSockets[userId]);
      }
    });
    return socketsIds;
  }

  public static async sendActiveRoomsToUsers() {
    const users = this.users;
    users.map((user) => {
      const userActiveGroups = Object.entries(this.rooms)
        .filter(([roomId, data]) => data.users.length > 0)
        .map(([roomId, data]) => data.group)
        .filter(
          (activeGroup) =>
            !!user.userGroupsChats?.find(
              (userChat) => userChat?.groupChat?.id === activeGroup.id
            )
        );
      const userSocketId = this.usersSockets[user.id];
      this.io
        .to(userSocketId)
        .emit("active-rooms", { activegGroupsChat: userActiveGroups });
    });
  }

  public static async sendNewGroupUpdate(group: GroupsChat) {
    const room = this.rooms[group.id];
    if (room) {
      room.group = group;
    }
    this.rooms = { ...this.rooms, [group.id]: room };
    this.sendActiveRoomsToUsers();
  }
}

export default Websocket;
