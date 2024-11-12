import { Socket } from "socket.io";

export const groupsChatEvents = (socket: Socket) => {
  socket.on("new-message", async (data, next) => {});
};
