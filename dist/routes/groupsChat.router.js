"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GroupsChat_controller_1 = require("../controllers/GroupsChat.controller");
const uploadFiles_1 = require("../middleware/uploadFiles");
const setImageUrl_1 = require("../middleware/setImageUrl");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const router = (0, express_1.Router)();
router.get("/", GroupsChat_controller_1.getGroupsChat);
router.post("/", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.addGroupChatValidator), (0, setImageUrl_1.setImageUrl)(), GroupsChat_controller_1.createGroupChat);
router.put("/:id", uploadFiles_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "backgroundCover", maxCount: 1 },
]), (0, setImageUrl_1.setImageUrl)(), (0, validationMiddleware_1.validateData)(GroupsChatValidator_1.updateGroupChatValidator), GroupsChat_controller_1.updateGroupChat);
router.get("/:id", GroupsChat_controller_1.getGroupChatById);
// router.post(
//   "/:id/users",
//   validateData(groupsChatUsersValidator),
//   addUsersToGroupChat
// );
// router.delete(
//   "/:id/users",
//   validateData(groupsChatUsersValidator),
//   removeUsersfromGroupChat
// );
// router.post("/:id/leave", leaveGroupChat);
exports.default = router;
//# sourceMappingURL=groupsChat.router.js.map