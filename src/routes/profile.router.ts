import { Router } from "express";
import { updateProfileData } from "../controllers/profile.controller";
import { validateData } from "../middleware/validationMiddleware";
import { updateProfileValidator } from "../utils/validators/profileValidator";

const router = Router();

router.put("/", validateData(updateProfileValidator), updateProfileData);

export default router;
