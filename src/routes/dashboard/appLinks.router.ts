import { Router } from "express";

import { validateData } from "../../middleware/validationMiddleware";
import { appLinksValidator } from "../../utils/validators/appLinksValidator";
import { addAppLinks } from "../../controllers/dashboard/appLinks.controller";

const router = Router();

router.post("/", validateData(appLinksValidator), addAppLinks);

export default router;
