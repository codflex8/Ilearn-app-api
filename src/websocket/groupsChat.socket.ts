import { Socket } from "socket.io";
import { GroupsChat } from "../models/GroupsChat.model";
import Websocket from "./websocket";
import {
  addNewMessage,
  getUserRooms,
  readMessages,
} from "../controllers/GroupsChat.controller";
import { newGroupChatMessageValidator } from "../utils/validators/GroupsChatValidator";
import schemaValidator from "../utils/schemaValidator";
import { GroupsChatMessages } from "../models/GroupsChatMessages.model";
import ApiError from "../utils/ApiError";

export const groupsChatEvents = (socket: Socket) => {
  socket.on("active-rooms", async () => {
    const user = socket.user;
    const activeRoomsIds = Websocket.getActiveRoomsIds();
    const rooms = await getUserRooms(activeRoomsIds, user.id);
    socket.emit("active-rooms", { rooms });
  });

  socket.on(
    "user-typing",
    async ({ groupChatId }: { groupChatId: string }, callback) => {
      const user = socket.user;
      if (!groupChatId) {
        if (callback)
          callback({ success: false, error: "groupcaht id  is required" });
      }
      const isGroupChatExit = await GroupsChat.isGroupChatExist(
        groupChatId,
        user.id
      );
      if (!isGroupChatExit) {
        if (callback)
          callback({
            message: `there is not groupchat with this groupchatId ${groupChatId}`,
          });
        return;
      }

      socket.to(groupChatId).emit("user-typing", {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }
  );

  socket.on(
    "join-room",
    async ({ groupChatId }: { groupChatId: string }, callback) => {
      const user = socket.user;
      if (!groupChatId) {
        if (callback)
          callback({ success: false, error: "groupcaht id  is required" });
        return;
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
        if (callback)
          callback({
            message: `there is not groupchat with this groupchatId ${groupChatId}`,
          });
        return;
      }
      socket.join(groupChatId);
      socket.to(groupChatId).emit("user-join-room", {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
      Websocket.addUserToRoom(groupChatId, user);
      console.log(
        `${socket.user?.username} joined room: ${groupChatId} ${groupChat.name}`
      );
      console.log(Websocket.getroomUsers(groupChatId));
      if (callback)
        callback({ success: true, message: `Joined room: ${groupChatId}` });
    }
  );

  socket.on(
    "new-message",
    async (data: { groupChatId: string; message: string }, callback) => {
      try {
        schemaValidator(newGroupChatMessageValidator, data);
        const { groupChatId, message } = data;
        const user = socket.user;
        const isUserInGroupChat = Websocket.getroomUsers(groupChatId).find(
          (u) => u.id === user.id
        );
        // if (!isUserInGroupChat) {
        //   if (callback)
        //     callback({ message: "the user did not joined in room " });
        //   return;
        // }

        await addNewMessage({ message, groupChatId, user });
        socket.to(groupChatId).emit("new-message", { message, groupChatId });
      } catch (error: any) {
        if (callback) callback({ message: error.message });
      }
    }
  );

  socket.on(
    "new-media-message",
    async (
      data: { groupChatId: string; message: GroupsChatMessages },
      callback
    ) => {
      try {
        const { groupChatId, message } = data;
        const user = socket.user;
        const isGroupchatExist = await GroupsChat.isGroupChatExist(
          groupChatId,
          user.id
        );
        if (!isGroupchatExist) {
          throw new ApiError("groupchat not found", 400);
        }
        socket.to(groupChatId).emit("new-media-message", { message });
      } catch (error: any) {
        if (callback) callback({ message: error.message });
      }
    }
  );

  socket.on(
    "read-messages",
    async (
      {
        messagesIds,
        groupChatId,
      }: { messagesIds: string[]; groupChatId: string },
      callback
    ) => {
      try {
        if (!groupChatId) {
          throw new ApiError("groupchat Id required", 400);
        }
        const user = socket.user;
        const isExist = await GroupsChat.isGroupChatExist(groupChatId, user.id);
        if (!isExist) throw new ApiError("groupchat not found", 400);
        readMessages({ chatId: groupChatId, messagesIds, userId: user.id });
      } catch (error: any) {
        if (callback) callback(error.message);
      }
    }
  );
};
