import { Router } from "express";
import { getNotifications } from "../../controllers/users/Notifications.controller";

const router = Router();

router.get("/", getNotifications);

export default router;
