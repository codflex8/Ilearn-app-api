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
import { httpLogger } from "./utils/logger";
import i18next from "i18next";
import cron from "node-cron";
import { usersStatisticsReminder } from "./controllers/users/statistics.controller";

const app = express();

new Server(app);
const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

const server = httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});

io.use(async (socket: Socket, callback) => {
  try {
    const userLng = socket.handshake.headers["accept-language"] || "en"; // Default to 'en' if not provided
    console.log("userLngggg", userLng, socket.handshake.headers);
    // Optionally, you can store the language in the socket instance
    // socket.language = userLng;

    // Use i18next with the user's language
    socket.t = i18next.getFixedT(userLng);
    if (
      socket.client.request.headers.authorization &&
      socket.client.request.headers.authorization.split(" ")[1]
    ) {
      const { currentUser, decoded } = await getUserFromToken(
        socket.client.request.headers.authorization.split(" ")[1],
        true
      );
      if (!currentUser) {
        callback(new ApiError("unauthorized", 401));
      }
      Websocket.addUser(currentUser, socket.id);
      socket.user = currentUser;
      callback();
    } else {
      callback(new ApiError("unauthorized", 401));
    }
  } catch (error: any) {
    callback(new ApiError(error.message, 401));
  }
});

io.on("connection", async (socket: Socket) => {
  httpLogger.info("user connect", { user: socket.user });
  socket.emit("connect-success");
  Websocket.sendActiveRoomsToUser(socket.user);
  chatbotEvents(socket);
  groupsChatEvents(socket);

  Websocket.sendNotificationsCount(socket.user.id);
  socket.on("error", (err) => {
    console.error(`Socket error from ${socket.id}:`, err.message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnect");
    Websocket.removeUser(socket.user);
  });
});

cron.schedule("0 20 * * 4", () => {
  const logMessage = `Job executed on: ${new Date().toISOString()}\n`;
  httpLogger.info(logMessage);
  usersStatisticsReminder();
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  console.log(err.stack);
  // server.close(() => {
  //   console.error(`Shutting down....`);
  //   process.exit(1);
  // });
});

// /usr/local/mysql/data/mysqld.local.pid
