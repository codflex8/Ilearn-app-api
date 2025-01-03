"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controllers/quiz.controller");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const QuizValidator_1 = require("../utils/validators/QuizValidator");
const router = (0, express_1.Router)();
router.get("/", quiz_controller_1.getQuizes);
router.post("/", (0, validationMiddleware_1.validateData)(QuizValidator_1.addQuizValidator), quiz_controller_1.addQuize);
router.put("/:id", (0, validationMiddleware_1.validateData)(QuizValidator_1.addQuizValidator), quiz_controller_1.updateQuiz);
router.get("/:id", quiz_controller_1.getQuizById);
router.delete("/:id", quiz_controller_1.deleteQuiz);
router.get("/:id/questions", quiz_controller_1.getQuizQuestions);
// router.get("/:id/questions/:questionId", getQuizQuestionById);
// router.post(
//   "/:id/questions",
//   validateData(addQuestionValidator),
//   addQuestionHanlder
// );
exports.default = router;
//# sourceMappingURL=quizes.router.js.map