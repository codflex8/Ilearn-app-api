import { Router } from "express";
import { getAppLinks } from "../../controllers/users/AppLinks.controller";
const router = Router();

router.get("/", getAppLinks);

export default router;
