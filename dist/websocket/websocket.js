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
            .filter(([roomId, users]) => users.length)
            .map(([roomId, users]) => roomId);
    }
    static getroomUsers(roomId) {
        var _a;
        return (_a = this.rooms[roomId]) !== null && _a !== void 0 ? _a : [];
    }
    static addUserToRoom(roomId, user) {
        var _a, _b;
        if (!((_a = this.rooms[roomId]) === null || _a === void 0 ? void 0 : _a.find((u) => u.id == (user === null || user === void 0 ? void 0 : user.id))) ||
            !this.rooms[roomId]) {
            const newRoomUsers = [...((_b = this.rooms[roomId]) !== null && _b !== void 0 ? _b : []), user];
            this.rooms = Object.assign(Object.assign({}, this.rooms), { [roomId]: newRoomUsers });
        }
    }
    static removeUserFromRoom(roomId, user) {
        const newRoomUsers = this.rooms[roomId].filter((u) => u.id !== user.id);
        this.rooms = Object.assign(Object.assign({}, this.rooms), { [roomId]: newRoomUsers });
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
Websocket.rooms = {};
exports.default = Websocket;
//# sourceMappingURL=websocket.js.map