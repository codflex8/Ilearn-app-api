import { Router } from "express";
import { getHomeStatistcs } from "../controllers/statistics.controller";

const router = Router();

router.get("/home", getHomeStatistcs);

export default router;
