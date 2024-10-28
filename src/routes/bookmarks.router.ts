import { Router } from "express";
import { addBookmark, getBookmarks } from "../controllers/bookmark.controller";
import { validateData } from "../middleware/validationMiddleware";
import { addBookmarkValidator } from "../utils/validators/BookmarkValidator";

const router = Router();

router.get("/", getBookmarks);
router.post("/", validateData(addBookmarkValidator), addBookmark);
export default router;
