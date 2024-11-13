"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsChatEvents = void 0;
const GroupsChat_model_1 = require("../models/GroupsChat.model");
const groupsChatEvents = (socket) => {
    socket.on("join-room", async ({ roomId }, next) => {
        const user = socket.user;
        const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
            where: {
                id: roomId,
                userGroupsChats: {
                    user: {
                        id: user.id,
                    },
                },
            },
        });
        if (!groupChat) {
            next(new Error("there is not groupchat with this roomId"));
        }
        socket.join(roomId);
    });
    socket.on("new-message", async (data, next) => { });
};
exports.groupsChatEvents = groupsChatEvents;
//# sourceMappingURL=groupsChat.socket.js.map