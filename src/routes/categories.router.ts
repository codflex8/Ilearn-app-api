import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryByID,
  updateCategory,
} from "../controllers/categories.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addCategoryValidator } from "../utils/validators/CategoryValidator";

const router = Router();

router.get("/", getCategories);
router.post("/", validateData(addCategoryValidator), addCategory);
router.get("/:id", getCategoryByID);
router.put("/:id", validateData(addCategoryValidator), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
