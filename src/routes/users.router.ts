import { Router } from "express";
import { addFcmToUser, getUsers } from "../controllers/users.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addFcmValidation } from "../utils/validators/AuthValidator";

const router = Router();

router.get("/users", getUsers);
router.post("/users/add-fcm", validateData(addFcmValidation), addFcmToUser);

export default router;
