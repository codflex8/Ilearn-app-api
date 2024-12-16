import { Router } from "express";
import {
  addFcmToUser,
  deleteUser,
  getUsers,
} from "../controllers/users.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addFcmValidation } from "../utils/validators/AuthValidator";

const router = Router();

router.get("/users", getUsers);
router.post("/users/add-fcm", validateData(addFcmValidation), addFcmToUser);
router.delete("/users/delete", deleteUser);
export default router;
