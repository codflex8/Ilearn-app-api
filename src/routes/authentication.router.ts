import express, { Router } from "express";
import {
  facebookAuthSignIn,
  facebookAuthSignUp,
  forgotPassword,
  googleAuthSignIn,
  googleAuthSignUp,
  protect,
  refreshToken,
  resendVerifyCode,
  resetPassword,
  signIn,
  signOut,
  signup,
  twitterAuthSignIn,
  twitterAuthSignUp,
  verifyPassResetCode,
  verifyUserEmail,
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

router.post(
  "/google/signup",
  validateData(socialMediaAuthValidator),
  googleAuthSignUp
);
router.post(
  "/google/signin",
  validateData(socialMediaAuthValidator),
  googleAuthSignIn
);

router.post(
  "/facebook/signup",
  validateData(socialMediaAuthValidator),
  facebookAuthSignUp
);
router.post(
  "/facebook/signin",
  validateData(socialMediaAuthValidator),
  facebookAuthSignIn
);

router.post(
  "/twitter/signup",
  validateData(twitterAuthValidator),
  twitterAuthSignUp
);

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

router.post(
  "/twitter/signin",
  validateData(twitterAuthValidator),
  twitterAuthSignIn
);

export default router;
