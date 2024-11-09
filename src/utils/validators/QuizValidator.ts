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
  // isCorrectAnswer: z.boolean().default(false),
  // isUserAnswer: z.boolean().default(false),
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
        console.log("dataaaa", data);
        if (
          data.type === QuestionType.MultiChoic ||
          data.type === QuestionType.TrueFalse
        ) {
          return data.answers.length > 1 && data.correctAnswerIndex != null;
        }
        return true;
      },
      {
        path: ["question"],
        message: "correctAnswerIndex required",
      }
    )
    .refine(
      (data) => {
        if (data.type === QuestionType.Writing) {
          return data.answers.length <= 2 && data.aiAnswerIndex;
        }
        return true;
      },
      {
        path: ["question"],
        message: "aiAnswerIndex required",
      }
    );

const addQuestionObject = z.object({
  question: z.string(),
  type: z.nativeEnum(QuestionType),
  userAnswerIndex: z.number().optional().nullable(),
  aiAnswerIndex: z.number().optional().nullable(),
  correctAnswerIndex: z.number().optional().nullable(),
  answers: z.array(z.string()),
  isBookmarked: z.boolean().optional().nullable(),
  // answers: z.array(addAnswerValidator),
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
  booksIds: z.array(z.string()).min(1, "should have at least one bookId"),
  questions: z.array(addQuestionValidator),
});
export const updateQuizValidator = addQuizValidator.extend({
  questions: z.array(updateQuestionValidator),
});
