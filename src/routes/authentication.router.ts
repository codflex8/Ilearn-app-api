import express, { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signup,
  verifyPassResetCode,
} from "../controllers/authentication.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  forgetPasswordValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyForgetPasswordValidator,
} from "../utils/validators/AuthValidator";
import { upload } from "../middleware/uploadFiles";
import { setImageUrl } from "../middleware/setImageUrl";

const router = Router();

router.post(
  "/signup",
  upload.single("image"),
  setImageUrl,
  validateData(signUpValidator),
  signup
);
router.post("/signin", validateData(signInValidator), signIn);
router.post(
  "/forgotPassword",
  validateData(forgetPasswordValidator),
  forgotPassword
);
router.post(
  "/verifyResetCode",
  validateData(verifyForgetPasswordValidator),
  verifyPassResetCode
);
router.put(
  "/resetPassword",
  validateData(resetPasswordValidator),
  resetPassword
);
export default router;
