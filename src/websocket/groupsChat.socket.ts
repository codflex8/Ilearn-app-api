import { Socket } from "socket.io";
import { GroupsChat } from "../models/GroupsChat.model";
import Websocket from "./websocket";
import {
  addNewMessage,
  readMessages,
} from "../controllers/GroupsChat.controller";

export const groupsChatEvents = (socket: Socket) => {
  socket.on(
    "join-room",
    async ({ groupChatId }: { groupChatId: string }, callback) => {
      const user = socket.user;
      if (!groupChatId) {
        return callback({ success: false, error: "groupcaht id  is required" });
      }
      const groupChat = await GroupsChat.findOne({
        where: {
          id: groupChatId,
          userGroupsChats: {
            user: {
              id: user.id,
            },
          },
        },
      });
      if (!groupChat) {
        return callback({
          message: `there is not groupchat with this groupchatId ${groupChatId}`,
        });
      }
      socket.join(groupChatId);
      Websocket.addUserToRoom(groupChatId, user);
      console.log(
        `${socket.user?.username} joined room: ${groupChatId} ${groupChat.name}`
      );
      console.log(Websocket.getroomUsers(groupChatId));
      callback({ success: true, message: `Joined room: ${groupChatId}` });
    }
  );

  socket.on(
    "new-message",
    async (
      { groupChatId, message }: { groupChatId: string; message: string },
      callback
    ) => {
      const user = socket.user;
      const isUserInGroupChat = Websocket.getroomUsers(groupChatId).find(
        (u) => u.id === user.id
      );
      if (!isUserInGroupChat) {
        return callback({ message: "the user did not joined in room " });
      }
      try {
        await addNewMessage({ message, groupChatId, user });
        socket.to(groupChatId).emit("new-message", { message });
      } catch (error: any) {
        callback({ message: error.message });
      }
    }
  );

  socket.on(
    "read-messages",
    (
      { messagesIds, chatId }: { messagesIds: string[]; chatId: string },
      callback
    ) => {
      const user = socket.user;
      readMessages({ chatId, messagesIds, userId: user.id });
    }
  );
};
