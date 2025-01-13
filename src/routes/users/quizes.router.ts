import { Router } from "express";
import {
  addQuestionHanlder,
  addQuize,
  deleteQuiz,
  getQuizById,
  getQuizes,
  getQuizQuestionById,
  getQuizQuestions,
  updateQuiz,
} from "../../controllers/users/quiz.controller";
import { validateData } from "../../middleware/validationMiddleware";
import {
  addQuizValidator,
  addQuestionValidator,
  updateQuizValidator,
} from "../../utils/validators/QuizValidator";

const router = Router();

router.get("/", getQuizes);
router.post("/", validateData(addQuizValidator), addQuize);
router.put("/:id", validateData(addQuizValidator), updateQuiz);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);
router.get("/:id/questions", getQuizQuestions);
// router.get("/:id/questions/:questionId", getQuizQuestionById);
// router.post(
//   "/:id/questions",
//   validateData(addQuestionValidator),
//   addQuestionHanlder
// );

export default router;
