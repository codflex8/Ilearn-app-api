import { z } from "zod";

export enum QuestionType {
  MultiChoic = "MultiChoic",
  TrueFalse = "TrueFalse",
  Writing = "Writing",
}

export enum QuizQuestionsType {
  MultiChoic = "MultiChoic",
  TrueFalse = "TrueFalse",
  Writing = "Writing",
  Random = "random",
}

export enum QuizLevel {
  Ease = "ease",
  Medium = "medium",
  Hard = "hard",
  Random = "random",
}

const addAnswerValidator = z.object({
  answer: z.string(),
  isCorrectAnswer: z.boolean().default(false),
  isUserAnswer: z.boolean().default(false),
});

const updateAnswerValidator = addAnswerValidator.extend({
  id: z.string(),
});

const questionValidatorWithRefine = (
  questionObject: typeof updateQuestionValidator
) =>
  questionObject
    .refine(
      (data) => {
        if (data.questionType === QuestionType.MultiChoic) {
          return (
            data.answers.length > 1 &&
            !!data.answers.find((answer) => answer.isCorrectAnswer)
          );
        }
        return true;
      },
      {
        path: ["question"],
        message:
          "multi choic, answers array should have multiple answers and one of them is the correct answer",
      }
    )
    .refine(
      (data) => {
        if (data.questionType === QuestionType.TrueFalse) {
          return (
            data.answers.length == 2 &&
            !!data.answers.find((answer) => answer.isCorrectAnswer)
          );
        }
        return true;
      },
      {
        path: ["question"],
        message:
          "true/false, answers array  should have 2 answers and one of them is the correct answer",
      }
    )
    .refine(
      (data) => {
        if (data.questionType === QuestionType.Writing) {
          return data.answers.length == 1;
        }
        return true;
      },
      {
        path: ["question"],
        message: "writing,  answers array should have 1 correct answer ",
      }
    )
    .refine(
      (data) => {
        return data.answers.filter((answer) => answer.isUserAnswer).length <= 1;
      },
      {
        path: ["question"],
        message: "can not have more than one user answer for the question",
      }
    );

const addQuestionObject = z.object({
  question: z.string(),
  questionType: z.nativeEnum(QuestionType),
  answers: z.array(addAnswerValidator),
});

export const addQuestionValidator =
  questionValidatorWithRefine(addQuestionObject);

export const updateQuestionValidator = questionValidatorWithRefine(
  addQuestionObject.extend({
    id: z.string(),
    answers: z.array(updateAnswerValidator),
  })
);

export const addQuizValidator = z.object({
  name: z.string(),
  mark: z.number().optional(),
  questionsType: z.nativeEnum(QuizQuestionsType),
  quizLevel: z.nativeEnum(QuizLevel),
  questions: z.array(addQuestionValidator),
});
export const updateQuizValidator = addQuizValidator.extend({
  questions: z.array(updateQuestionValidator),
});
