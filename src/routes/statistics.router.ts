import { Router } from "express";
import {
  getHomeStatistcs,
  getProfileStatistics,
} from "../controllers/statistics.controller";

const router = Router();

router.get("/home", getHomeStatistcs);
router.get("/reports", getProfileStatistics);
export default router;
