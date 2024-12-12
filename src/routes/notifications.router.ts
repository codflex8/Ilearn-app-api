import { Router } from "express";
import { getNotifications } from "../controllers/Notifications.controller";

const router = Router();

router.get("/", getNotifications);

export default router;
