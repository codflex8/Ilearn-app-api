"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChatRoles = exports.newGroupChatMessageValidator = exports.updateGroupChatValidator = exports.addGroupChatValidator = exports.acceptJoinRequestValidator = exports.groupsChatUsersValidator = exports.MessageType = void 0;
const zod_1 = require("zod");
var MessageType;
(function (MessageType) {
    MessageType["messages"] = "messages";
    MessageType["images"] = "images";
    MessageType["records"] = "records";
    MessageType["files"] = "files";
    MessageType["links"] = "links";
})(MessageType || (exports.MessageType = MessageType = {}));
exports.groupsChatUsersValidator = zod_1.z.object({
    usersIds: zod_1.z.array(zod_1.z.string()),
});
exports.acceptJoinRequestValidator = zod_1.z.object({
    userId: zod_1.z.string(),
});
exports.addGroupChatValidator = zod_1.z.object({
    name: zod_1.z.string(),
    usersIds: zod_1.z.array(zod_1.z.string()).nullable().default([]),
});
exports.updateGroupChatValidator = exports.addGroupChatValidator.extend({
    muteNotification: zod_1.z
        .string()
        .transform((val) => val === "true")
        .default("false"),
    backgroundColor: zod_1.z.string().optional().nullable(),
    removeCover: zod_1.z
        .string()
        .transform((val) => val === "true")
        .default("false"),
});
exports.newGroupChatMessageValidator = zod_1.z
    .object({
    message: zod_1.z.string().optional().nullable(),
    image: zod_1.z.string().optional().nullable(),
    record: zod_1.z.string().optional().nullable(),
    file: zod_1.z.string().optional().nullable(),
})
    .refine((data) => data.message || data.record || data.image || data.file, {
    message: "can not add empty message",
    path: ["message || record || image || file"],
});
var GroupChatRoles;
(function (GroupChatRoles) {
    GroupChatRoles["Admin"] = "admin";
    GroupChatRoles["Member"] = "member";
    GroupChatRoles["ReadOnly"] = "ReadOnly";
})(GroupChatRoles || (exports.GroupChatRoles = GroupChatRoles = {}));
//# sourceMappingURL=GroupsChatValidator.js.map