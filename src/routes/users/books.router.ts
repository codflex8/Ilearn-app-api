import { Router } from "express";
import {
  addBook,
  deleteBook,
  getBooks,
  getBookById,
  updateBook,
  setLocalPath,
  getWrongQuestions,
} from "../../controllers/users/books.controller";
import { validateData } from "../../middleware/validationMiddleware";
import {
  addBookValidator,
  setLocalPathValidation,
} from "../../utils/validators/BookValidator";
import { s3Upload, upload } from "../../middleware/uploadFiles";

const router = Router();

router.get("/", getBooks);

router.post(
  "/",
  s3Upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
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
router.post(
  "/:id/local-path",
  validateData(setLocalPathValidation),
  setLocalPath
);
router.delete("/:id", deleteBook);
router.get("/:id/wrong-questions", getWrongQuestions);

export default router;
