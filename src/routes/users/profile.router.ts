import { Router } from "express";
import { updateProfileData } from "../../controllers/users/profile.controller";
import { validateData } from "../../middleware/validationMiddleware";
import { updateProfileValidator } from "../../utils/validators/profileValidator";
import { upload } from "../../middleware/uploadFiles";

const router = Router();

router.put(
  "/",
  upload.single("image"),
  validateData(updateProfileValidator),
  updateProfileData
);

export default router;
