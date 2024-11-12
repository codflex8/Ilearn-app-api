import { Router } from "express";
import {
  addBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook,
} from "../controllers/books.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addBookValidator } from "../utils/validators/BookValidator";
import { upload } from "../middleware/uploadFiles";

const router = Router();

router.get("/", getBooks);
router.post(
  "/",
  upload.single("image"),
  validateData(addBookValidator),
  addBook
);
router.get("/:id", getBookById);
router.put(
  "/:id",
  upload.single("image"),
  validateData(addBookValidator),
  updateBook
);
router.delete("/:id", deleteBook);

export default router;
