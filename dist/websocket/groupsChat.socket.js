"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsChatEvents = void 0;
const groupsChatEvents = (io) => {
    io.emit("groups-chat-event", { test: "groups-chat-event" });
};
exports.groupsChatEvents = groupsChatEvents;
//# sourceMappingURL=groupsChat.socket.js.map