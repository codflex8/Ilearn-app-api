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

const router = Router();

router.get("/", getBooks);
router.post("/", validateData(addBookValidator), addBook);
router.get("/:id", getBookById);
router.put("/:id", validateData(addBookValidator), updateBook);
router.delete("/:id", deleteBook);

export default router;
