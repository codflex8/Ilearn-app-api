import { Router } from "express";
import {
  getUsers,
  removeUserStatus,
  toggleUserStatus,
} from "../../controllers/dashboard/users.controller";

const router = Router();

router.get("/", getUsers);
router.post("/:id/status", toggleUserStatus);
router.delete("/:id", removeUserStatus);

export default router;
