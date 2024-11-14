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
    static getroomUsers(roomId) {
        var _a;
        return (_a = this.roomUsers[roomId]) !== null && _a !== void 0 ? _a : [];
    }
    static addUserToRoom(roomId, user) {
        var _a, _b;
        if (!((_a = this.roomUsers[roomId]) === null || _a === void 0 ? void 0 : _a.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id))) ||
            !this.roomUsers[roomId]) {
            const newRoomUsers = [...((_b = this.roomUsers[roomId]) !== null && _b !== void 0 ? _b : []), user];
            this.roomUsers = Object.assign(Object.assign({}, this.roomUsers), { [roomId]: newRoomUsers });
        }
    }
    static removeUserFromRoom(roomId, user) {
        const newRoomUsers = this.roomUsers[roomId].filter((u) => u.id !== user.id);
        this.roomUsers = Object.assign(Object.assign({}, this.roomUsers), { [roomId]: newRoomUsers });
    }
    static getUsers() {
        return this.users;
    }
    static addUser(user) {
        if (!this.users.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id))) {
            this.users = [...this.users, user];
        }
    }
    static removeUser(user) {
        var _a;
        this.users = (_a = this.users) === null || _a === void 0 ? void 0 : _a.filter((u) => u.id !== user.id);
    }
}
Websocket.users = [];
Websocket.roomUsers = {};
exports.default = Websocket;
//# sourceMappingURL=websocket.js.map