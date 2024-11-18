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
        const isGroupChatExit = await GroupsChat_model_1.GroupsChat.isGroupChatExist(groupChatId);
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
        websocket_1.default.addUserToRoom(groupChatId, user);
        console.log(`${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.username} joined room: ${groupChatId} ${groupChat.name}`);
        console.log(websocket_1.default.getroomUsers(groupChatId));
        if (callback)
            callback({ success: true, message: `Joined room: ${groupChatId}` });
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
            await (0, GroupsChat_controller_1.addNewMessage)({ message, groupChatId, user });
            socket.to(groupChatId).emit("new-message", { message });
        }
        catch (error) {
            if (callback)
                callback({ message: error.message });
        }
    });
    socket.on("read-messages", ({ messagesIds, chatId }, callback) => {
        try {
            const user = socket.user;
            (0, GroupsChat_controller_1.readMessages)({ chatId, messagesIds, userId: user.id });
        }
        catch (error) {
            if (callback)
                callback(error.message);
        }
    });
};
exports.groupsChatEvents = groupsChatEvents;
//# sourceMappingURL=groupsChat.socket.js.map