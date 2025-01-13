import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryByID,
  updateCategory,
} from "../../controllers/users/categories.controller";
import { validateData } from "../../middleware/validationMiddleware";
import { addCategoryValidator } from "../../utils/validators/CategoryValidator";
import { upload } from "../../middleware/uploadFiles";

const router = Router();

router.get("/", getCategories);
router.post(
  "/",
  upload.single("image"),
  validateData(addCategoryValidator),
  addCategory
);
router.get("/:id", getCategoryByID);
router.put(
  "/:id",
  upload.single("image"),
  validateData(addCategoryValidator),
  updateCategory
);
router.delete("/:id", deleteCategory);

export default router;
