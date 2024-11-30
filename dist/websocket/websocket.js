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
            .filter(([roomId, usersGroup]) => { var _a; return (_a = usersGroup.users) === null || _a === void 0 ? void 0 : _a.length; })
            .map(([roomId, users]) => roomId);
    }
    static getroomUsers(roomId) {
        var _a, _b;
        return (_b = (_a = this.rooms[roomId]) === null || _a === void 0 ? void 0 : _a.users) !== null && _b !== void 0 ? _b : [];
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
        var _a, _b, _c, _d;
        if (!this.rooms[group.id] ||
            !((_b = (_a = this.rooms[group.id]) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id)))) {
            const newRoomUsers = [...((_d = (_c = this.rooms[group.id]) === null || _c === void 0 ? void 0 : _c.users) !== null && _d !== void 0 ? _d : []), user];
            this.rooms = Object.assign(Object.assign({}, this.rooms), { [group.id]: { group, users: newRoomUsers } });
        }
    }
    static removeUserFromRoom(roomId, user) {
        var _a, _b, _c;
        const newRoomUsers = (_b = (_a = this.rooms[roomId]) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.filter((u) => u.id !== user.id);
        this.rooms = Object.assign(Object.assign({}, this.rooms), { [roomId]: { group: (_c = this.rooms[roomId]) === null || _c === void 0 ? void 0 : _c.group, users: newRoomUsers } });
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
                .filter(([roomId, data]) => { var _a; return data && ((_a = data.users) === null || _a === void 0 ? void 0 : _a.length) > 0; })
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