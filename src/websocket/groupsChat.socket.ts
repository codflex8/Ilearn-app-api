import { Socket } from "socket.io";

export const groupsChatEvents = (io: Socket) => {
  io.emit("groups-chat-event", { test: "groups-chat-event" });
};
