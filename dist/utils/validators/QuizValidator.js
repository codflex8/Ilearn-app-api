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
    isCorrectAnswer: zod_1.z.boolean().default(false),
    isUserAnswer: zod_1.z.boolean().default(false),
});
const updateAnswerValidator = addAnswerValidator.extend({
    id: zod_1.z.string(),
});
const questionValidatorWithRefine = (questionObject) => questionObject
    .refine((data) => {
    if (data.questionType === QuestionType.MultiChoic) {
        return (data.answers.length > 1 &&
            !!data.answers.find((answer) => answer.isCorrectAnswer));
    }
    return true;
}, {
    path: ["question"],
    message: "multi choic, answers array should have multiple answers and one of them is the correct answer",
})
    .refine((data) => {
    if (data.questionType === QuestionType.TrueFalse) {
        return (data.answers.length == 2 &&
            !!data.answers.find((answer) => answer.isCorrectAnswer));
    }
    return true;
}, {
    path: ["question"],
    message: "true/false, answers array  should have 2 answers and one of them is the correct answer",
})
    .refine((data) => {
    if (data.questionType === QuestionType.Writing) {
        return (data.answers.length <= 2 &&
            data.answers.find((answer) => answer.isCorrectAnswer));
    }
    return true;
}, {
    path: ["question"],
    message: "writing,  answers array should have 1 correct answer ",
})
    .refine((data) => {
    return data.answers.filter((answer) => answer.isUserAnswer).length <= 1;
}, {
    path: ["question"],
    message: "can not have more than one user answer for the question",
})
    .refine((data) => {
    return (data.answers.filter((answer) => answer.isCorrectAnswer).length <= 1);
}, {
    path: ["question"],
    message: "can not have more than one correct answer for the question",
});
const addQuestionObject = zod_1.z.object({
    question: zod_1.z.string(),
    type: zod_1.z.nativeEnum(QuestionType),
    answers: zod_1.z.array(addAnswerValidator),
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
    booksIds: zod_1.z.array(zod_1.z.string()),
    questions: zod_1.z.array(exports.addQuestionValidator),
});
exports.updateQuizValidator = exports.addQuizValidator.extend({
    questions: zod_1.z.array(exports.updateQuestionValidator),
});
//# sourceMappingURL=QuizValidator.js.map