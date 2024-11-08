import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import Server from "./app";
import { createServer } from "http";
import Websocket from "./websocket/websocket";
import { Socket } from "socket.io";
const app = express();

new Server(app);
const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

const server = httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});

io.on("connection", (socket: Socket) => {
  console.log("user connection");
  socket.emit("coonect-success");
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

// /usr/local/mysql/data/mysqld.local.pid
