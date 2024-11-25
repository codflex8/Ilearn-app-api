"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const WEBSOCKET_CORS = {
    origin: "*",
    // methods: ["GET", "POST"],
};
class Websocket extends socket_io_1.Server {
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
    static getInstance(httpServer) {
        if (!this.io) {
            this.io = new Websocket(httpServer);
        }
        return this.io;
    }
    static getActiveRoomsIds() {
        return Object.entries(this.rooms)
            .filter(([roomId, usersGroup]) => usersGroup.users.length)
            .map(([roomId, users]) => roomId);
    }
    static getroomUsers(roomId) {
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
    static addUserToRoom(group, user) {
        var _a, _b, _c;
        if (!this.rooms[group.id] ||
            !((_a = this.rooms[group.id]) === null || _a === void 0 ? void 0 : _a.users.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id)))) {
            const newRoomUsers = [...((_c = (_b = this.rooms[group.id]) === null || _b === void 0 ? void 0 : _b.users) !== null && _c !== void 0 ? _c : []), user];
            this.rooms = Object.assign(Object.assign({}, this.rooms), { [group.id]: { group, users: newRoomUsers } });
        }
    }
    static removeUserFromRoom(roomId, user) {
        var _a, _b;
        const newRoomUsers = (_a = this.rooms[roomId]) === null || _a === void 0 ? void 0 : _a.users.filter((u) => u.id !== user.id);
        this.rooms = Object.assign(Object.assign({}, this.rooms), { [roomId]: { group: (_b = this.rooms[roomId]) === null || _b === void 0 ? void 0 : _b.group, users: newRoomUsers } });
    }
    static getUsers() {
        return this.users;
    }
    static addUser(user, socketId) {
        if (!this.users.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id))) {
            this.users = [...this.users, user];
        }
        this.usersSockets = Object.assign(Object.assign({}, this.usersSockets), { [user.id]: socketId });
    }
    static removeUser(user) {
        var _a, _b;
        if (user)
            this.users = (_b = ((_a = this.users) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.filter((u) => u.id !== (user === null || user === void 0 ? void 0 : user.id));
    }
    static getUsersSocketIds(usersIds) {
        const socketsIds = [];
        usersIds.forEach((userId) => {
            if (this.usersSockets[userId]) {
                socketsIds.push(this.usersSockets[userId]);
            }
        });
        return socketsIds;
    }
    static async sendActiveRoomsToUsers() {
        const users = this.users;
        users.map((user) => {
            const userActiveGroups = Object.entries(this.rooms)
                .filter(([roomId, data]) => data && data.users.length > 0)
                .map(([roomId, data]) => data.group)
                .filter((activeGroup) => {
                var _a;
                return !!((_a = user.userGroupsChats) === null || _a === void 0 ? void 0 : _a.find((userChat) => { var _a; return ((_a = userChat === null || userChat === void 0 ? void 0 : userChat.groupChat) === null || _a === void 0 ? void 0 : _a.id) === activeGroup.id; }));
            });
            const userSocketId = this.usersSockets[user.id];
            this.io
                .to(userSocketId)
                .emit("active-rooms", { activegGroupsChat: userActiveGroups });
        });
    }
    static async sendNewGroupUpdate(group) {
        const room = this.rooms[group.id];
        if (room) {
            room.group = group;
        }
        this.rooms = Object.assign(Object.assign({}, this.rooms), { [group.id]: room });
        this.sendActiveRoomsToUsers();
    }
}
Websocket.users = [];
Websocket.rooms = {};
// private static activeGroupsChat: GroupsChat[] = [];
Websocket.usersSockets = {};
exports.default = Websocket;
//# sourceMappingURL=websocket.js.map