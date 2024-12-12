"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GroupsChat_controller_1 = require("../controllers/GroupsChat.controller");
const uploadFiles_1 = require("../middleware/uploadFiles");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const router = (0, express_1.Router)();
router.get("/", GroupsChat_controller_1.getGroupsChat);
router.post("/", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.addGroupChatValidator), GroupsChat_controller_1.createGroupChat);
router.put("/:id", uploadFiles_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "backgroundCover", maxCount: 1 },
]), (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.updateGroupChatValidator), GroupsChat_controller_1.updateGroupChat);
router.get("/:id", GroupsChat_controller_1.getGroupChatById);
router.get("/:id/messages", GroupsChat_controller_1.getGroupChatMessages);
router.post("/:id/messages", uploadFiles_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "record", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.newGroupChatMessageValidator), GroupsChat_controller_1.newGroupChatMessage);
router.post("/:id/users", (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.groupsChatUsersValidator), GroupsChat_controller_1.addUsersToGroupChat);
router.delete("/:id/users", (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.groupsChatUsersValidator), GroupsChat_controller_1.removeUsersfromGroupChat);
router.post("/:id/join-group", GroupsChat_controller_1.joinGroup);
router.post("/:id/accept-join", GroupsChat_controller_1.acceptJoinGroup);
router.post("/:id/accept-user-join", (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.acceptJoinRequestValidator), GroupsChat_controller_1.acceptJoinRequest);
router.post("/:id/leave", GroupsChat_controller_1.leaveGroupChat);
exports.default = router;
//# sourceMappingURL=groupsChat.router.js.map