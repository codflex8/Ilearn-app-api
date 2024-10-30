import { Router } from "express";
import { updateProfileData } from "../controllers/profile.controller";
import { validateData } from "../middleware/validationMiddleware";
import { updateProfileValidator } from "../utils/validators/profileValidator";
import { upload } from "../middleware/uploadFiles";
import { setImageUrl } from "../middleware/setImageUrl";

const router = Router();

router.put(
  "/",
  upload.single("image"),
  setImageUrl,
  validateData(updateProfileValidator),
  updateProfileData
);

export default router;
