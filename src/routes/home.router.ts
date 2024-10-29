import { Router } from "express";
import { archive, home } from "../controllers/home.controller";

const router = Router();

router.get("/home", home);
router.get("/archive", archive);

export default router;
