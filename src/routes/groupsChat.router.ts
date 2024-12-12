import { Router } from "express";
import {
  acceptJoinGroup,
  acceptJoinRequest,
  addUsersToGroupChat,
  createGroupChat,
  getGroupChatById,
  getGroupChatMessages,
  getGroupsChat,
  joinGroup,
  leaveGroupChat,
  newGroupChatMessage,
  removeUsersfromGroupChat,
  updateGroupChat,
} from "../controllers/GroupsChat.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import {
  acceptJoinRequestValidator,
  addGroupChatValidator,
  groupsChatUsersValidator,
  newGroupChatMessageValidator,
  updateGroupChatValidator,
} from "../utils/validators/GroupsChatValidator";

const router = Router();

router.get("/", getGroupsChat);
router.post(
  "/",
  upload.single("image"),
  validateData(addGroupChatValidator),
  createGroupChat
);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "backgroundCover", maxCount: 1 },
  ]),
  validateData(updateGroupChatValidator),
  updateGroupChat
);
router.get("/:id", getGroupChatById);
router.get("/:id/messages", getGroupChatMessages);
router.post(
  "/:id/messages",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "record", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateData(newGroupChatMessageValidator),
  newGroupChatMessage
);
router.post(
  "/:id/users",
  validateData(groupsChatUsersValidator),
  addUsersToGroupChat
);
router.delete(
  "/:id/users",
  validateData(groupsChatUsersValidator),
  removeUsersfromGroupChat
);

router.post("/:id/join-group", joinGroup);
router.post("/:id/accept-join", acceptJoinGroup);
router.post(
  "/:id/accept-user-join",
  validateData(acceptJoinRequestValidator),
  acceptJoinRequest
);

router.post("/:id/leave", leaveGroupChat);

export default router;
