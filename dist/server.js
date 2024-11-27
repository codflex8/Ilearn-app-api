"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const websocket_1 = __importDefault(require("./websocket/websocket"));
const chatbots_websocket_1 = require("./websocket/chatbots.websocket");
const groupsChat_socket_1 = require("./websocket/groupsChat.socket");
const getUserFromToken_1 = require("./utils/getUserFromToken");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
new app_1.default(app);
const httpServer = (0, http_1.createServer)(app);
const io = websocket_1.default.getInstance(httpServer);
const server = httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`listen on ${process.env.PORT || 3000} port`);
});
io.use(async (socket, callback) => {
    try {
        if (socket.client.request.headers.authorization &&
            socket.client.request.headers.authorization.split(" ")[1]) {
            const { currentUser, decoded } = await (0, getUserFromToken_1.getUserFromToken)(socket.client.request.headers.authorization.split(" ")[1], true);
            if (!currentUser) {
                callback(new ApiError_1.default("unauthorized", 401));
            }
            websocket_1.default.addUser(currentUser, socket.id);
            socket.user = currentUser;
            callback();
        }
        else {
            callback(new ApiError_1.default("unauthorized", 401));
        }
    }
    catch (error) {
        callback(new ApiError_1.default(error.message, 401));
    }
});
io.on("connection", async (socket) => {
    logger_1.httpLogger.info("user connect", { user: socket.user });
    socket.emit("connect-success");
    (0, chatbots_websocket_1.chatbotEvents)(socket);
    (0, groupsChat_socket_1.groupsChatEvents)(socket);
    socket.on("error", (err) => {
        console.error(`Socket error from ${socket.id}:`, err.message);
    });
    socket.on("disconnect", () => {
        console.log("user disconnect");
        websocket_1.default.removeUser(socket.user);
    });
});
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    console.log(err.stack);
    // server.close(() => {
    //   console.error(`Shutting down....`);
    //   process.exit(1);
    // });
});
// /usr/local/mysql/data/mysqld.local.pid
//# sourceMappingURL=server.js.map