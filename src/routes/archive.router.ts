import { Router } from "express";
import {
  getArchiveChatbots,
  getArchiveQuizes,
} from "../controllers/archive.controller";

const router = Router();

router.get("/chatbots", getArchiveChatbots);
router.get("/quizes", getArchiveQuizes);

export default router;
