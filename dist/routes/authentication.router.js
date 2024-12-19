"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_controller_1 = require("../controllers/authentication.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const AuthValidator_1 = require("../utils/validators/AuthValidator");
const uploadFiles_1 = require("../middleware/uploadFiles");
const router = (0, express_1.Router)();
router.post("/signup", uploadFiles_1.upload.single("image"), (0, validationMiddleware_1.validateData)(AuthValidator_1.signUpValidator), authentication_controller_1.signup);
router.post("/signin", (0, validationMiddleware_1.validateData)(AuthValidator_1.signInValidator), authentication_controller_1.signIn);
router.post("/signout", authentication_controller_1.protect, authentication_controller_1.signOut);
router.post("/refreshToken", authentication_controller_1.refreshToken);
router.post("/forgotPassword", (0, validationMiddleware_1.validateData)(AuthValidator_1.forgetPasswordValidator), authentication_controller_1.forgotPassword);
router.post("/verifyResetCode", (0, validationMiddleware_1.validateData)(AuthValidator_1.verifyForgetPasswordValidator), authentication_controller_1.verifyPassResetCode);
router.put("/resetPassword", (0, validationMiddleware_1.validateData)(AuthValidator_1.resetPasswordValidator), authentication_controller_1.resetPassword);
router.post("/google/signup", (0, validationMiddleware_1.validateData)(AuthValidator_1.socialMediaAuthValidator), authentication_controller_1.googleAuthSignUp);
router.post("/google/signin", (0, validationMiddleware_1.validateData)(AuthValidator_1.socialMediaAuthValidator), authentication_controller_1.googleAuthSignIn);
router.post("/facebook/signup", (0, validationMiddleware_1.validateData)(AuthValidator_1.socialMediaAuthValidator), authentication_controller_1.facebookAuthSignUp);
router.post("/facebook/signin", (0, validationMiddleware_1.validateData)(AuthValidator_1.socialMediaAuthValidator), authentication_controller_1.facebookAuthSignIn);
router.post("/twitter/signup", (0, validationMiddleware_1.validateData)(AuthValidator_1.twitterAuthValidator), authentication_controller_1.twitterAuthSignUp);
router.post("/twitter/signin", (0, validationMiddleware_1.validateData)(AuthValidator_1.twitterAuthValidator), authentication_controller_1.twitterAuthSignIn);
exports.default = router;
//# sourceMappingURL=authentication.router.js.map