import { Router } from "express";
import {
  addUsersToGroupChat,
  createGroupChat,
  getGroupChatById,
  getGroupChatMessages,
  getGroupsChat,
  leaveGroupChat,
  removeUsersfromGroupChat,
  updateGroupChat,
} from "../controllers/GroupsChat.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import {
  addGroupChatValidator,
  groupsChatUsersValidator,
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
  "/:id/users",
  validateData(groupsChatUsersValidator),
  addUsersToGroupChat
);
router.delete(
  "/:id/users",
  validateData(groupsChatUsersValidator),
  removeUsersfromGroupChat
);

router.post("/:id/leave", leaveGroupChat);

export default router;
