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
const app = (0, express_1.default)();
new app_1.default(app);
const httpServer = (0, http_1.createServer)(app);
const io = websocket_1.default.getInstance(httpServer);
const server = httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`listen on ${process.env.PORT || 3000} port`);
});
io.on("connection", (socket) => {
    console.log("user connection");
    socket.emit("coonect-success");
});
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});
// /usr/local/mysql/data/mysqld.local.pid
//# sourceMappingURL=server.js.map