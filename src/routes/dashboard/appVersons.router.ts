import { Router } from "express";

import { validateData } from "../../middleware/validationMiddleware";
import { appVersionsValidator } from "../../utils/validators/appLinksValidator";
import { addAppVersions } from "../../controllers/dashboard/appLinks.controller";

const router = Router();

router.post("/", validateData(appVersionsValidator), addAppVersions);

export default router;
