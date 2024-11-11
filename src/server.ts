import "reflect-metadata";
import express from "express";
import Server from "./app";
import { createServer } from "http";
import Websocket from "./websocket/websocket";
import { Socket } from "socket.io";
import { chatbotEvents } from "./websocket/chatbots.websocket";
import { groupsChatEvents } from "./websocket/groupsChat.socket";
import { getUserFromToken } from "./utils/getUserFromToken";
import ApiError from "./utils/ApiError";

const app = express();

new Server(app);
const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

const server = httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});

io.use(async (socket, next) => {
  const { currentUser, decoded } = await getUserFromToken(
    socket.client.request.headers.authorization
  );
  console.log("curent userrr", currentUser);
  if (!currentUser) {
    next(new ApiError("unauthorized", 401));
  }
  // socket.
  next();
});

io.on("connection", async (socket: Socket) => {
  console.log("user connect");
  socket.emit("connect-success");
  chatbotEvents(socket);
  groupsChatEvents(socket);

  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

// /usr/local/mysql/data/mysqld.local.pid
