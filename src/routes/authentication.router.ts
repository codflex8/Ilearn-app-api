import express, { Router } from "express";
import {
  forgotPassword,
  protect,
  refreshToken,
  resendVerifyCode,
  resetPassword,
  signIn,
  signOut,
  signup,
  verifyPassResetCode,
  verifyUserEmail,
  googleAuth,
  facebookAuth,
  twitterAuth,
} from "../controllers/authentication.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  forgetPasswordValidator,
  socialMediaAuthValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyForgetPasswordValidator,
  twitterAuthValidator,
  verifyEmailValidator,
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
router.post("/signout", protect, signOut);

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

router.post("/google", validateData(socialMediaAuthValidator), googleAuth);
router.post("/facebook", validateData(socialMediaAuthValidator), facebookAuth);
router.post("/twitter", validateData(twitterAuthValidator), twitterAuth);

router.post(
  "/resend-verification-email",
  validateData(forgetPasswordValidator),
  resendVerifyCode
);
router.post(
  "/verify-email",
  validateData(verifyEmailValidator),
  verifyUserEmail
);

export default router;
