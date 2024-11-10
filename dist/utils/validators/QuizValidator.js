"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizValidator = exports.addQuizValidator = exports.updateQuestionValidator = exports.addQuestionValidator = exports.QuizLevel = exports.QuizQuestionsType = exports.QuestionType = void 0;
const zod_1 = require("zod");
var QuestionType;
(function (QuestionType) {
    QuestionType["MultiChoic"] = "MultiChoic";
    QuestionType["TrueFalse"] = "TrueFalse";
    QuestionType["Writing"] = "Writing";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var QuizQuestionsType;
(function (QuizQuestionsType) {
    QuizQuestionsType["MultiChoic"] = "MultiChoic";
    QuizQuestionsType["TrueFalse"] = "TrueFalse";
    QuizQuestionsType["Writing"] = "Writing";
    QuizQuestionsType["Random"] = "random";
})(QuizQuestionsType || (exports.QuizQuestionsType = QuizQuestionsType = {}));
var QuizLevel;
(function (QuizLevel) {
    QuizLevel["Ease"] = "ease";
    QuizLevel["Medium"] = "medium";
    QuizLevel["Hard"] = "hard";
    QuizLevel["Random"] = "random";
})(QuizLevel || (exports.QuizLevel = QuizLevel = {}));
const addAnswerValidator = zod_1.z.object({
    answer: zod_1.z.string(),
    // isCorrectAnswer: z.boolean().default(false),
    // isUserAnswer: z.boolean().default(false),
});
const updateAnswerValidator = addAnswerValidator.extend({
    id: zod_1.z.string(),
});
const questionValidatorWithRefine = (questionObject) => questionObject
    .refine((data) => {
    console.log("dataaaa", data);
    if (data.type === QuestionType.MultiChoic ||
        data.type === QuestionType.TrueFalse) {
        return data.answers.length > 1 && data.correctAnswerIndex != null;
    }
    return true;
}, {
    path: ["question"],
    message: "correctAnswerIndex required",
})
    .refine((data) => {
    if (data.type === QuestionType.Writing) {
        return data.answers.length <= 2 && data.aiAnswerIndex;
    }
    return true;
}, {
    path: ["question"],
    message: "aiAnswerIndex required",
});
const addQuestionObject = zod_1.z.object({
    question: zod_1.z.string(),
    type: zod_1.z.nativeEnum(QuestionType),
    userAnswerIndex: zod_1.z.number().optional().nullable(),
    aiAnswerIndex: zod_1.z.number().optional().nullable(),
    correctAnswerIndex: zod_1.z.number().optional().nullable(),
    answers: zod_1.z.array(zod_1.z.string()),
    isBookmarked: zod_1.z.boolean().optional().nullable(),
    // answers: z.array(addAnswerValidator),
});
exports.addQuestionValidator = questionValidatorWithRefine(addQuestionObject);
exports.updateQuestionValidator = questionValidatorWithRefine(addQuestionObject.extend({
    id: zod_1.z.string(),
    answers: zod_1.z.array(updateAnswerValidator),
}));
exports.addQuizValidator = zod_1.z.object({
    name: zod_1.z.string(),
    mark: zod_1.z.number().optional(),
    questionsType: zod_1.z.nativeEnum(QuizQuestionsType),
    quizLevel: zod_1.z.nativeEnum(QuizLevel),
    booksIds: zod_1.z.array(zod_1.z.string()).min(1, "should have at least one bookId"),
    questions: zod_1.z.array(exports.addQuestionValidator),
});
exports.updateQuizValidator = exports.addQuizValidator.extend({
    questions: zod_1.z.array(exports.updateQuestionValidator),
});
//# sourceMappingURL=QuizValidator.js.map