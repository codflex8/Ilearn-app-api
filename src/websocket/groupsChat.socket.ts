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
import { User } from "../models/User.model";
import { httpLogger } from "../utils/logger";

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
      Websocket.addUserToRoom(groupChat, user);
      const groupChatUsers = await User.find({
        where: {
          userGroupsChats: {
            groupChat: {
              id: groupChatId,
            },
          },
        },
        select: { id: true },
      });
      const groupChatUsersIds = groupChatUsers.map((user) => user.id);
      const socketsIds = Websocket.getUsersSocketIds(groupChatUsersIds);
      // socketsIds.map()
      if (callback)
        callback({ success: true, message: `Joined room: ${groupChatId}` });
      Websocket.sendActiveRoomsToAllUsers();
    }
  );

  socket.on(
    "leave-room",
    async ({ groupChatId }: { groupChatId: string }, callback) => {
      try {
        const user = socket.user;
        const groupchatExist = await GroupsChat.isGroupChatExist(
          groupChatId,
          user?.id
        );
        if (!groupchatExist) {
          throw new ApiError("group chat not found", 400);
        }
        socket.leave(groupChatId);
        Websocket.removeUserFromRoom(groupChatId, user);
        Websocket.sendActiveRoomsToAllUsers();
        if (callback)
          callback({ success: true, message: `leave room: ${groupChatId}` });
      } catch (error: any) {
        if (callback) callback({ message: error.message });
      }
    }
  );

  socket.on(
    "new-message",
    async (data: { groupChatId: string; message: string }, callback) => {
      try {
        schemaValidator(newGroupChatMessageValidator, data);
        const { groupChatId, message } = data;
        const user = socket.user;
        // const isUserInGroupChat = Websocket.getroomUsers(groupChatId)?.find(
        //   (u) => u.id === user.id
        // );

        // const groupchatUsers = Websocket.getroomUsers(groupChatId);
        // const groupchatUsersSockets = Websocket.getUsersSocketIds(
        //   groupchatUsers.map((user) => user.id)
        // );

        httpLogger.info(
          `new message from ${user.username}, message: ${message},`
        );
        const newMessage = await addNewMessage({ message, groupChatId, user });
        socket
          .to(groupChatId)
          .emit("new-message", { message: newMessage, groupChatId });
      } catch (error: any) {
        if (callback) callback({ message: error.message });
      }
    }
  );

  socket.on(
    "new-media-message",
    async (data: { groupChatId: string; messageId: string }, callback) => {
      try {
        const { groupChatId, messageId } = data;
        const user = socket.user;
        const isGroupchatExist = await GroupsChat.isGroupChatExist(
          groupChatId,
          user.id
        );
        if (!isGroupchatExist) {
          throw new ApiError("groupchat not found", 400);
        }
        const getMessage = await GroupsChatMessages.getRepository()
          .createQueryBuilder("message")
          .leftJoinAndSelect("message.from", "user")
          .where("message.id = :messageId", { messageId })
          .andWhere("user.id = :userId", { userId: user.id })
          .select("message")
          .addSelect([
            "user.email",
            "user.phoneNumber",
            "user.username",
            "user.birthDate",
            "user.gender",
            "user.imageUrl",
          ])
          .getOne();
        //   ({
        //   where: {
        //     id: messageId,
        //     from: {
        //       id: user.id,
        //     },
        //   },
        // });
        if (!getMessage) {
          throw new ApiError("message not found", 400);
        }
        socket
          .to(groupChatId)
          .emit("new-media-message", { message: getMessage, groupChatId });
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

  socket.on(
    "share-group",
    async (
      {
        sharedGroupId,
        toGroupId,
      }: { sharedGroupId: string; toGroupId: string },
      callback
    ) => {
      try {
        const user = socket.user;
        const sharedGroup = await GroupsChat.getUserGroupChatById(
          user.id,
          sharedGroupId
        );
        if (!sharedGroup) {
          throw new ApiError("sharedGroupId not found", 400);
        }
        const toGroupChat = await GroupsChat.getUserGroupChatById(
          user.id,
          toGroupId
        );
        if (!toGroupChat) {
          throw new ApiError("toGroupChat not found", 400);
        }
        const newMessage = await addNewMessage({
          user,
          groupChatId: toGroupChat.id,
          sharedGroup,
        });
        console.log("call setimageeee");
        newMessage.sharedGroup?.setFullImageUrl();
        socket.to(toGroupId).emit("new-message", {
          message: newMessage,
          groupChatId: toGroupChat.id,
        });

        // .emit("share-group", { newMessage });
      } catch (error: any) {
        if (callback) callback(error.message);
      }
    }
  );
};
