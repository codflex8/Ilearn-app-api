import { Router } from "express";
import {
  addAdmin,
  protectAdmin,
  defaultAdmin,
  signin,
} from "../../controllers/dashboard/authenticate.controller";

const router = Router();

router.post("/sign-in", signin);
router.post("/default-admin", defaultAdmin);
router.post("/add-admin", protectAdmin, addAdmin);

export default router;
