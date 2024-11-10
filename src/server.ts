import "reflect-metadata";
import express from "express";
import Server from "./app";
import { createServer } from "http";
import Websocket from "./websocket/websocket";
import { Socket } from "socket.io";
import { chatbotEvents } from "./websocket/chatbots.websocket";
import { groupsChatEvents } from "./websocket/groupsChat.socket";
const app = express();

new Server(app);
const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

const server = httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});

io.on("connection", (socket: Socket) => {
  socket.emit("connect-success");
  chatbotEvents(socket);
  groupsChatEvents(socket);
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

// /usr/local/mysql/data/mysqld.local.pid
