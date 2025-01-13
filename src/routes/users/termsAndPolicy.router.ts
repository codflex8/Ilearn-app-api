import { Router } from "express";
import {
  addTerms,
  getTerms,
  addPolicy,
  getPolicy,
} from "../../controllers/users/termsAndPolicy.controller";
import { validateData } from "../../middleware/validationMiddleware";
import {
  addPolicyValidator,
  addTermValidator,
} from "../../utils/validators/termsAndPolicyValidator";

const router = Router();

router.get("/terms", getTerms);
router.post("/terms", validateData(addTermValidator), addTerms);

router.get("/policy", getPolicy);
router.post("/policy", validateData(addPolicyValidator), addPolicy);

export default router;
