"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChatRoles = exports.updateGroupChatValidator = exports.addGroupChatValidator = exports.groupsChatUsersValidator = void 0;
const zod_1 = require("zod");
exports.groupsChatUsersValidator = zod_1.z.object({
    usersIds: zod_1.z.array(zod_1.z.string()),
});
exports.addGroupChatValidator = zod_1.z.object({
    name: zod_1.z.string(),
    usersIds: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.updateGroupChatValidator = exports.addGroupChatValidator.extend({
    muteNotification: zod_1.z.boolean().default(false),
    backgroundColor: zod_1.z.string().optional().nullable(),
});
var GroupChatRoles;
(function (GroupChatRoles) {
    GroupChatRoles["Admin"] = "admin";
    GroupChatRoles["Member"] = "member";
    GroupChatRoles["ReadOnly"] = "ReadOnly";
})(GroupChatRoles || (exports.GroupChatRoles = GroupChatRoles = {}));
//# sourceMappingURL=GroupsChatValidator.js.map