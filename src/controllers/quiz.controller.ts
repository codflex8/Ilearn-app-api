import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Quiz } from "../models/Quiz.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { Equal, FindOptionsWhere, ILike, In } from "typeorm";
import { QuestionType, QuizLevel } from "../utils/validators/QuizValidator";
import ApiError from "../utils/ApiError";
import { Question } from "../models/Questions.model";
import { Answer } from "../models/Answers.model";
import { Book } from "../models/Books.model";
import { BaseQuery } from "../utils/validators/BaseQuery";
import { Bookmark } from "../models/Bookmarks.model";
import { User } from "../models/User.model";

interface QuizeQuery extends BaseQuery {
  name: string;
  questionsType: QuestionType;
  quizLevel: QuizLevel;
  booksIds: Array<string>;
}

export const getQuizes = asyncHandler(
  async (
    req: Request<{}, {}, {}, QuizeQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const { page, pageSize, name, questionsType, quizLevel, booksIds } =
      req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    let conditions: FindOptionsWhere<Quiz> = {
      user: {
        id: user.id,
      },
    };
    if (name) conditions = { ...conditions, name: ILike(`%${name}%`) };
    if (questionsType)
      conditions = {
        ...conditions,
        questionsType: Equal(questionsType as QuestionType),
      };
    if (quizLevel)
      conditions = {
        ...conditions,
        quizLevel: Equal(quizLevel as QuizLevel),
      };
    if (booksIds && booksIds.length > 0) {
      conditions = {
        ...conditions,
        books: {
          id: In(booksIds),
        },
      };
    }
    const [quizes, count] = await Quiz.findAndCount({
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
      .json(new GenericResponse<Quiz>(Number(page), take, count, quizes));
  }
);

export const addQuize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, questionsType, quizLevel, questions, mark, booksIds } =
      req.body;
    const user = req.user;
    const books = await Book.find({
      where: {
        id: In(booksIds),
      },
    });
    if (!books.length) {
      return next(
        new ApiError(req.t("cannot_find_any_book_of_books_ids"), 400)
      );
    }
    const newQuiz = Quiz.create({
      name,
      questionsType,
      quizLevel,
      user,
      mark,
      books,
      questions: questions.map((question) =>
        addQuestion({
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
        })
      ),
    });
    await newQuiz.save();
    delete newQuiz.user;
    res.status(201).json({ quiz: newQuiz });
  }
);

export const updateQuiz = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { name, questionsType, quizLevel, questions, mark, booksIds } =
      req.body;
    const quiz = await Quiz.getUserQuizById(user.id, id);
    if (!quiz) {
      return next(new ApiError(req.t("quiz_not_found"), 400));
    }
    const books = await Book.find({
      where: {
        id: In(booksIds),
      },
    });
    quiz.name = name;
    quiz.quizLevel = quizLevel;
    quiz.questionsType = questionsType;
    quiz.questions = questions.map((question) =>
      addQuestion({
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
      })
    );
    quiz.mark = mark;
    quiz.books = books;
    await quiz.save();
    res.status(200).json({ quiz });
  }
);

export const getQuizById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const quiz = await Quiz.getUserQuizById(user.id, id);
    // ToDo: optimize this block
    if (quiz) {
      const newQuizObj = {
        ...quiz,
        questions: quiz.questions.map((ques) => {
          const question = {
            ...ques,
            answers: ques.answers?.map((ans) => ans.answer),
          };
          return question;
        }),
      };
      res.status(200).json({ quiz: newQuizObj });
      return;
    }

    res.status(200).json({ quiz });
  }
);

export const deleteQuiz = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const quiz = await Quiz.getUserQuizById(user.id, id);
    await quiz.remove();
    res.status(200).json({ quiz });
  }
);

export const getQuizQuestions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { page, pageSize, name, questionsType, quizLevel } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const [questions, count] = await Question.findAndCount({
      where: {
        quiz: {
          id: Equal(id),
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
      .json(
        new GenericResponse<Question>(Number(page), take, count, questions)
      );
  }
);

export const getQuizQuestionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, questionId } = req.params;
    const user = req.user;
    const question = await Question.findOne({
      where: {
        id: questionId,
        quiz: {
          id: Equal(id),
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
  }
);

const addQuestion = ({
  question,
  type,
  answers,
  userAnswerIndex,
  aiAnswerIndex,
  correctAnswerIndex,
  isBookmarked,
  user,
  userAnswer,
  aiAnswer,
  isCorrect,
}: {
  question: string;
  type: QuestionType;
  answers: string[];
  userAnswerIndex: number;
  aiAnswerIndex: number;
  correctAnswerIndex: number;
  isBookmarked: boolean;
  user: User;
  aiAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}) => {
  const newQuestion = Question.create({
    question,
    type,
    userAnswerIndex,
    correctAnswerIndex,
    aiAnswer,
    userAnswer,
    isCorrect,
    answers: answers.map((answer, index) =>
      Answer.create({
        answer,
        // isCorrectAnswer: answer.isCorrectAnswer,
        // isUserAnswer: answer.isUserAnswer,
      })
    ),
    bookmark: isBookmarked
      ? Bookmark.create({
          user,
        })
      : null,
  });

  return newQuestion;
};

export const addQuestionHanlder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const {
      question,
      type,
      answers,
      userAnswerIndex,
      aiAnswerIndex,
      correctAnswerIndex,
      isCorrect,
    } = req.body;
    const quiz = await Quiz.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    if (!quiz) return next(new ApiError(req.t("quiz_not_found"), 400));
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
  }
);
