import { Router } from "express";
import {
  addTermsAndPolicy,
  getTermsAndPolicy,
} from "../controllers/termsAndPolicy.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addTermAndPolicyValidator } from "../utils/validators/termsAndPolicyValidator";

const router = Router();

router.get("/", getTermsAndPolicy);
router.post("/", validateData(addTermAndPolicyValidator), addTermsAndPolicy);

export default router;
