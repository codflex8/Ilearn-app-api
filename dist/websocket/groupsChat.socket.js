"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsChatEvents = void 0;
const GroupsChat_model_1 = require("../models/GroupsChat.model");
const websocket_1 = __importDefault(require("./websocket"));
const GroupsChat_controller_1 = require("../controllers/GroupsChat.controller");
const groupsChatEvents = (socket) => {
    socket.on("join-room", async ({ groupChatId }, callback) => {
        var _a;
        const user = socket.user;
        if (!groupChatId) {
            return callback({ success: false, error: "groupcaht id  is required" });
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
            return callback({
                message: `there is not groupchat with this groupchatId ${groupChatId}`,
            });
        }
        socket.join(groupChatId);
        websocket_1.default.addUserToRoom(groupChatId, user);
        console.log(`${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.username} joined room: ${groupChatId} ${groupChat.name}`);
        console.log(websocket_1.default.getroomUsers(groupChatId));
        callback({ success: true, message: `Joined room: ${groupChatId}` });
    });
    socket.on("new-message", async ({ groupChatId, message }, callback) => {
        const user = socket.user;
        const isUserInGroupChat = websocket_1.default.getroomUsers(groupChatId).find((u) => u.id === user.id);
        if (!isUserInGroupChat) {
            return callback({ message: "the user did not joined in room " });
        }
        try {
            await (0, GroupsChat_controller_1.addNewMessage)({ message, groupChatId, user });
            socket.to(groupChatId).emit("new-message", { message });
        }
        catch (error) {
            callback({ message: error.message });
        }
    });
};
exports.groupsChatEvents = groupsChatEvents;
//# sourceMappingURL=groupsChat.socket.js.map