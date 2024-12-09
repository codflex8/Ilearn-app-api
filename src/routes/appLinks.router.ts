import { Router } from "express";
import { addAppLinks, getAppLinks } from "../controllers/AppLinks.controller";
import { validateData } from "../middleware/validationMiddleware";
import { appLinksValidator } from "../utils/validators/appLinksValidator";

const router = Router();

router.get("/", getAppLinks);
router.post("/", validateData(appLinksValidator), addAppLinks);

export default router;
