import { Router } from "express";
import { getAppVersions } from "../../controllers/users/AppLinks.controller";

const router = Router();

router.get("/", getAppVersions);

export default router;
