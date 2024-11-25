import express, { Router } from "express";
import {
  forgotPassword,
  googleAuthSignIn,
  googleAuthSignUp,
  refreshToken,
  resetPassword,
  signIn,
  signup,
  verifyPassResetCode,
} from "../controllers/authentication.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  forgetPasswordValidator,
  googleAuthValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyForgetPasswordValidator,
} from "../utils/validators/AuthValidator";
import { upload } from "../middleware/uploadFiles";

const router = Router();

router.post(
  "/signup",
  upload.single("image"),
  validateData(signUpValidator),
  signup
);
router.post("/signin", validateData(signInValidator), signIn);
router.post("/refreshToken", refreshToken);
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

router.post(
  "/google-signup",
  validateData(googleAuthValidator),
  googleAuthSignUp
);
router.post(
  "/google-signin",
  validateData(googleAuthValidator),
  googleAuthSignIn
);

export default router;
