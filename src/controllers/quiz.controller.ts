import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Quiz } from "../models/Quiz.model";
import { getPaginationData } from "../utils/getPaginationData";
import { GenericResponse } from "../utils/GenericResponse";
import { Equal, FindOptionsWhere, ILike } from "typeorm";
import { QuestionType, QuizLevel } from "../utils/validators/QuizValidator";
import ApiError from "../utils/ApiError";
import { Question } from "../models/Questions.model";
import { Answer } from "../models/Answers.model";

export const getQuizes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { page, pageSize, name, questionsType, quizLevel } = req.query;
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
    const [quizes, count] = await Quiz.findAndCount({
      where: conditions,
      skip,
      take,
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
    const { name, questionsType, quizLevel, questions, mark } = req.body;
    const user = req.user;
    const newQuiz = Quiz.create({
      name,
      questionsType,
      quizLevel,
      user,
      mark,
      questions: questions.map((question) =>
        addQuestion({
          question: question.question,
          answers: question.answers,
          questionType: question.questionType,
        })
      ),
    });
    await newQuiz.save();
    res.status(201).json({ quiz: newQuiz });
  }
);

export const updateQuiz = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { name, questionsType, quizLevel, questions, mark } = req.body;
    const quiz = await Quiz.getUserQuizById(user.id, id);
    if (!quiz) {
      return next(new ApiError("quiz not found", 400));
    }
    quiz.name = name;
    quiz.quizLevel = quizLevel;
    quiz.questionsType = questionsType;
    quiz.questions = questions;
    quiz.mark = mark;
    await quiz.save();
    res.status(200).json({ quiz });
  }
);

export const getQuizById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const quiz = await Quiz.getUserQuizById(user.id, id);
    if (!quiz) {
      res.status(203).json({ message: "no content" });
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
  questionType,
  answers,
}: {
  question: string;
  questionType: QuestionType;
  answers: Answer[];
}) => {
  const newQuestion = Question.create({
    question,
    type: questionType,
    answers: answers.map((answer) =>
      Answer.create({
        answer: answer.answer,
        isCorrectAnswer: answer.isCorrectAnswer,
        isUserAnswer: answer.isUserAnswer,
      })
    ),
  });

  return newQuestion;
};

export const addQuestionHanlder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { question, questionType, answers } = req.body;
    const quiz = await Quiz.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
    if (!quiz) return next(new ApiError("quiz not found", 400));
    const newQuestion = addQuestion({
      question,
      questionType,
      answers,
    });
    newQuestion.quiz = quiz;
    await newQuestion.save();
    res.status(201).json({ newQuestion });
  }
);
