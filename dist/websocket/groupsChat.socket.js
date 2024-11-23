"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsChatEvents = void 0;
const GroupsChat_model_1 = require("../models/GroupsChat.model");
const websocket_1 = __importDefault(require("./websocket"));
const GroupsChat_controller_1 = require("../controllers/GroupsChat.controller");
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const schemaValidator_1 = __importDefault(require("../utils/schemaValidator"));
const GroupsChatMessages_model_1 = require("../models/GroupsChatMessages.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const User_model_1 = require("../models/User.model");
const groupsChatEvents = (socket) => {
    socket.on("active-rooms", async () => {
        const user = socket.user;
        const activeRoomsIds = websocket_1.default.getActiveRoomsIds();
        const rooms = await (0, GroupsChat_controller_1.getUserRooms)(activeRoomsIds, user.id);
        socket.emit("active-rooms", { rooms });
    });
    socket.on("user-typing", async ({ groupChatId }, callback) => {
        const user = socket.user;
        if (!groupChatId) {
            if (callback)
                callback({ success: false, error: "groupcaht id  is required" });
        }
        const isGroupChatExit = await GroupsChat_model_1.GroupsChat.isGroupChatExist(groupChatId, user.id);
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
    });
    socket.on("join-room", async ({ groupChatId }, callback) => {
        var _a;
        const user = socket.user;
        if (!groupChatId) {
            if (callback)
                callback({ success: false, error: "groupcaht id  is required" });
            return;
        }
        const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
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
        websocket_1.default.addUserToRoom(groupChat, user);
        const groupChatUsers = await User_model_1.User.find({
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
        const socketsIds = websocket_1.default.getUsersSocketIds(groupChatUsersIds);
        // socketsIds.map()
        if (callback)
            callback({ success: true, message: `Joined room: ${groupChatId}` });
        websocket_1.default.sendActiveRoomsToUsers();
        console.log("groupChatUsersssss", groupChatUsers, socketsIds);
        console.log(`${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.username} joined room: ${groupChatId} ${groupChat.name}`);
    });
    socket.on("leave-room", async ({ groupChatId }, callback) => {
        try {
            const user = socket.user;
            const groupchatExist = await GroupsChat_model_1.GroupsChat.isGroupChatExist(groupChatId, user === null || user === void 0 ? void 0 : user.id);
            if (!groupchatExist) {
                throw new ApiError_1.default("group chat not found", 400);
            }
            socket.leave(groupChatId);
            websocket_1.default.removeUserFromRoom(groupChatId, user);
            websocket_1.default.sendActiveRoomsToUsers();
            if (callback)
                callback({ success: true, message: `leave room: ${groupChatId}` });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
    socket.on("new-message", async (data, callback) => {
        try {
            (0, schemaValidator_1.default)(GroupsChatValidator_1.newGroupChatMessageValidator, data);
            const { groupChatId, message } = data;
            const user = socket.user;
            const isUserInGroupChat = websocket_1.default.getroomUsers(groupChatId).find((u) => u.id === user.id);
            // if (!isUserInGroupChat) {
            //   if (callback)
            //     callback({ message: "the user did not joined in room " });
            //   return;
            // }
            const groupchatUsers = websocket_1.default.getroomUsers(groupChatId);
            console.log(`new message from ${user.username}, message: ${message}, ${groupchatUsers}`);
            const newMessage = await (0, GroupsChat_controller_1.addNewMessage)({ message, groupChatId, user });
            socket
                .to(groupChatId)
                .emit("new-message", { message: newMessage, groupChatId });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
    socket.on("new-media-message", async (data, callback) => {
        try {
            const { groupChatId, message } = data;
            const user = socket.user;
            const isGroupchatExist = await GroupsChat_model_1.GroupsChat.isGroupChatExist(groupChatId, user.id);
            if (!isGroupchatExist) {
                throw new ApiError_1.default("groupchat not found", 400);
            }
            const isMessageExist = await GroupsChatMessages_model_1.GroupsChatMessages.findOne({
                where: {
                    id: message.id,
                    from: {
                        id: user.id,
                    },
                },
            });
            if (!isMessageExist) {
                throw new ApiError_1.default("message not found", 400);
            }
            socket
                .to(groupChatId)
                .emit("new-media-message", { message, groupChatId });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
    socket.on("read-messages", async ({ messagesIds, groupChatId, }, callback) => {
        try {
            if (!groupChatId) {
                throw new ApiError_1.default("groupchat Id required", 400);
            }
            const user = socket.user;
            const isExist = await GroupsChat_model_1.GroupsChat.isGroupChatExist(groupChatId, user.id);
            if (!isExist)
                throw new ApiError_1.default("groupchat not found", 400);
            (0, GroupsChat_controller_1.readMessages)({ chatId: groupChatId, messagesIds, userId: user.id });
        }
        catch (error) {
            if (callback)
                callback(error.message);
        }
    });
};
exports.groupsChatEvents = groupsChatEvents;
//# sourceMappingURL=groupsChat.socket.js.map