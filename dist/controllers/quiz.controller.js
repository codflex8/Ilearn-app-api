"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuestionHanlder = exports.getQuizQuestionById = exports.getQuizQuestions = exports.deleteQuiz = exports.getQuizById = exports.updateQuiz = exports.addQuize = exports.getQuizes = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Quiz_model_1 = require("../models/Quiz.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const typeorm_1 = require("typeorm");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Questions_model_1 = require("../models/Questions.model");
const Answers_model_1 = require("../models/Answers.model");
const Books_model_1 = require("../models/Books.model");
const Bookmarks_model_1 = require("../models/Bookmarks.model");
exports.getQuizes = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, name, questionsType, quizLevel, booksIds } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let conditions = {
        user: {
            id: user.id,
        },
    };
    if (name)
        conditions = Object.assign(Object.assign({}, conditions), { name: (0, typeorm_1.ILike)(`%${name}%`) });
    if (questionsType)
        conditions = Object.assign(Object.assign({}, conditions), { questionsType: (0, typeorm_1.Equal)(questionsType) });
    if (quizLevel)
        conditions = Object.assign(Object.assign({}, conditions), { quizLevel: (0, typeorm_1.Equal)(quizLevel) });
    if (booksIds && booksIds.length > 0) {
        conditions = Object.assign(Object.assign({}, conditions), { books: {
                id: (0, typeorm_1.In)(booksIds),
            } });
    }
    const [quizes, count] = await Quiz_model_1.Quiz.findAndCount({
        where: conditions,
        skip,
        take,
        // relations: {
        //   questions: true,
        // },
        order: {
            createdAt: "DESC",
        },
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, quizes));
});
exports.addQuize = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, questionsType, quizLevel, questions, mark, booksIds } = req.body;
    const user = req.user;
    const books = await Books_model_1.Book.find({
        where: {
            id: (0, typeorm_1.In)(booksIds),
        },
    });
    if (!books.length) {
        return next(new ApiError_1.default(req.t("cannot_find_any_book_of_books_ids"), 400));
    }
    const newQuiz = Quiz_model_1.Quiz.create({
        name,
        questionsType,
        quizLevel,
        user,
        mark,
        books,
        questions: questions.map((question) => addQuestion({
            question: question.question,
            answers: question.answers,
            type: question.type,
            userAnswerIndex: question.userAnswerIndex,
            aiAnswerIndex: question.aiAnswerIndex,
            correctAnswerIndex: question.correctAnswerIndex,
            isBookmarked: question.isBookmarked,
            aiAnswer: question.aiAnswer,
            userAnswer: question.userAnswer,
            user,
            isCorrect: question.isCorrect,
        })),
    });
    await newQuiz.save();
    delete newQuiz.user;
    res.status(201).json({ quiz: newQuiz });
});
exports.updateQuiz = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { name, questionsType, quizLevel, questions, mark, booksIds } = req.body;
    const quiz = await Quiz_model_1.Quiz.getUserQuizById(user.id, id);
    if (!quiz) {
        return next(new ApiError_1.default(req.t("quiz_not_found"), 400));
    }
    const books = await Books_model_1.Book.find({
        where: {
            id: (0, typeorm_1.In)(booksIds),
        },
    });
    quiz.name = name;
    quiz.quizLevel = quizLevel;
    quiz.questionsType = questionsType;
    quiz.questions = questions.map((question) => addQuestion({
        question: question.question,
        answers: question.answers,
        type: question.type,
        userAnswerIndex: question.userAnswerIndex,
        aiAnswerIndex: question.aiAnswerIndex,
        correctAnswerIndex: question.correctAnswerIndex,
        isBookmarked: question.isBookmarked,
        aiAnswer: question.aiAnswer,
        userAnswer: question.userAnswer,
        user,
        isCorrect: question.isCorrect,
    }));
    quiz.mark = mark;
    quiz.books = books;
    await quiz.save();
    res.status(200).json({ quiz });
});
exports.getQuizById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const quiz = await Quiz_model_1.Quiz.getUserQuizById(user.id, id);
    // ToDo: optimize this block
    if (quiz) {
        const newQuizObj = Object.assign(Object.assign({}, quiz), { questions: quiz.questions.map((ques) => {
                var _a;
                const question = Object.assign(Object.assign({}, ques), { answers: (_a = ques.answers) === null || _a === void 0 ? void 0 : _a.map((ans) => ans.answer) });
                return question;
            }) });
        res.status(200).json({ quiz: newQuizObj });
        return;
    }
    res.status(200).json({ quiz });
});
exports.deleteQuiz = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const quiz = await Quiz_model_1.Quiz.getUserQuizById(user.id, id);
    await quiz.remove();
    res.status(200).json({ quiz });
});
exports.getQuizQuestions = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { page, pageSize, name, questionsType, quizLevel } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const [questions, count] = await Questions_model_1.Question.findAndCount({
        where: {
            quiz: {
                id: (0, typeorm_1.Equal)(id),
                user: {
                    id: user.id,
                },
            },
        },
        relations: {
            answers: true,
        },
        skip,
        take,
        order: {
            createdAt: "desc",
        },
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, questions));
});
exports.getQuizQuestionById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id, questionId } = req.params;
    const user = req.user;
    const question = await Questions_model_1.Question.findOne({
        where: {
            id: questionId,
            quiz: {
                id: (0, typeorm_1.Equal)(id),
                user: {
                    id: user.id,
                },
            },
        },
        relations: {
            answers: true,
            bookmark: true,
        },
    });
    res.status(200).json({ question });
});
const addQuestion = ({ question, type, answers, userAnswerIndex, aiAnswerIndex, correctAnswerIndex, isBookmarked, user, userAnswer, aiAnswer, isCorrect, }) => {
    const newQuestion = Questions_model_1.Question.create({
        question,
        type,
        userAnswerIndex,
        correctAnswerIndex,
        aiAnswer,
        userAnswer,
        isCorrect,
        answers: answers.map((answer, index) => Answers_model_1.Answer.create({
            answer,
            // isCorrectAnswer: answer.isCorrectAnswer,
            // isUserAnswer: answer.isUserAnswer,
        })),
        bookmark: isBookmarked
            ? Bookmarks_model_1.Bookmark.create({
                user,
            })
            : null,
    });
    return newQuestion;
};
exports.addQuestionHanlder = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { question, type, answers, userAnswerIndex, aiAnswerIndex, correctAnswerIndex, isCorrect, } = req.body;
    const quiz = await Quiz_model_1.Quiz.findOne({
        where: {
            id,
            user: {
                id: user.id,
            },
        },
    });
    if (!quiz)
        return next(new ApiError_1.default(req.t("quiz_not_found"), 400));
    const newQuestion = addQuestion({
        question,
        type,
        answers,
        userAnswerIndex,
        aiAnswerIndex,
        correctAnswerIndex,
        isBookmarked: question.isBookmarked,
        user,
        isCorrect,
        aiAnswer: question.aiAnswer,
        userAnswer: question.userAnswer,
    });
    newQuestion.quiz = quiz;
    await newQuestion.save();
    res.status(201).json({ newQuestion });
});
//# sourceMappingURL=quiz.controller.js.map