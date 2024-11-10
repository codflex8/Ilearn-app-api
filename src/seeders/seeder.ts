// src/seeds/SeedData.ts
import { dataSource as AppDataSource } from "../models/dataSource";
import { User } from "../models/User.model";
import { Category } from "../models/Categories.model";
import { Book } from "../models/Books.model";
import { Chatbot } from "../models/ChatBot.model";
import { Quiz } from "../models/Quiz.model";
import { Question } from "../models/Questions.model";
import { Answer } from "../models/Answers.model";
import { GenderEnum } from "../utils/validators/AuthValidator";
import { QuestionType } from "../utils/validators/QuizValidator";
import { QuizLevel } from "../utils/validators/QuizValidator";
import { hash } from "bcryptjs";

async function seed() {
  const dataSource = await AppDataSource.initialize();
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const bookRepository = dataSource.getRepository(Book);
  const chatbotRepository = dataSource.getRepository(Chatbot);
  const quizRepository = dataSource.getRepository(Quiz);
  const questionRepository = dataSource.getRepository(Question);
  const answerRepository = dataSource.getRepository(Answer);

  console.log("Seeding data...");

  // Step 1: Create Users with realistic data
  const users = await userRepository.save([
    {
      email: "ibrahim@gmail.com",
      phoneNumber: "1234567890",
      username: "ibrahim",
      password: await hash("123456", 10),
      birthDate: new Date("1990-02-10"),
      gender: GenderEnum.FEMALE,
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      email: "ahmed@gmail.com",
      phoneNumber: "1234567891",
      username: "bob",
      password: await hash("123456", 10),
      birthDate: new Date("1988-05-22"),
      gender: GenderEnum.MALE,
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      email: "carol.doe@example.com",
      phoneNumber: "1234567892",
      username: "carol",
      password: await hash("securePass3", 10),
      birthDate: new Date("1995-08-15"),
      gender: GenderEnum.FEMALE,
      imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      email: "dave.williams@example.com",
      phoneNumber: "1234567893",
      username: "dave",
      password: await hash("securePass4", 10),
      birthDate: new Date("1985-03-10"),
      gender: GenderEnum.MALE,
      imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    },
  ]);
  console.log("Users created!");

  // Step 2: Create Categories
  const categories = await categoryRepository.save([
    {
      name: "Science Fiction",
      user: users[0],
      imageUrl: "https://example.com/scifi.jpg",
    },
    {
      name: "Fantasy",
      user: users[1],
      imageUrl: "https://example.com/fantasy.jpg",
    },
    {
      name: "Non-fiction",
      user: users[2],
      imageUrl: "https://example.com/nonfiction.jpg",
    },
    {
      name: "Mystery",
      user: users[3],
      imageUrl: "https://example.com/mystery.jpg",
    },
    {
      name: "Romance",
      user: users[0],
      imageUrl: "https://example.com/romance.jpg",
    },
  ]);
  console.log("Categories created!");

  // Step 3: Create Books with meaningful titles
  const books = await bookRepository.save([
    {
      name: "Dune",
      imageUrl: "https://example.com/dune.jpg",
      fileUrl: "https://example.com/dune.pdf",
      link: "https://example.com/dune",
      content: "A science fiction epic set on the desert planet Arrakis.",
      category: categories[0],
      user: users[0],
    },
    {
      name: "The Hobbit",
      imageUrl: "https://example.com/hobbit.jpg",
      fileUrl: "https://example.com/hobbit.pdf",
      link: "https://example.com/hobbit",
      content: "The journey of Bilbo Baggins in Middle-earth.",
      category: categories[1],
      user: users[1],
    },
    {
      name: "Sapiens: A Brief History of Humankind",
      imageUrl: "https://example.com/sapiens.jpg",
      fileUrl: "https://example.com/sapiens.pdf",
      link: "https://example.com/sapiens",
      content: "An exploration of the history and impact of Homo sapiens.",
      category: categories[2],
      user: users[2],
    },
  ]);
  console.log("Books created!");

  // Step 4: Create Chatbots
  const chatbots = await chatbotRepository.save([
    { name: "SciFiBot", user: users[0], books: [books[0]] },
    { name: "FantasyHelper", user: users[1], books: [books[1]] },
    { name: "HistoryBot", user: users[2], books: [books[2]] },
  ]);
  console.log("Chatbots created!");

  // Step 5: Create Quizzes
  const quizzes = await quizRepository.save([
    {
      name: "Science Fiction Trivia",
      mark: 20,
      questionsType: QuestionType.MultiChoic,
      quizLevel: QuizLevel.Ease,
      user: users[0],
      books: [books[0]],
    },
    {
      name: "Middle-earth Lore",
      mark: 15,
      questionsType: QuestionType.TrueFalse,
      quizLevel: QuizLevel.Medium,
      user: users[1],
      books: [books[1]],
    },
  ]);
  console.log("Quizzes created!");

  // Step 6: Create Questions
  const questions = await questionRepository.save([
    {
      question: "What is the desert planet in Dune?",
      type: QuestionType.MultiChoic,
      quiz: quizzes[0],
      correctAnswerIndex: 0,
    },
    {
      question: "Is Bilbo Baggins a wizard?",
      type: QuestionType.TrueFalse,
      quiz: quizzes[1],
      correctAnswerIndex: 1,
    },
  ]);
  console.log("Questions created!");

  // Step 7: Create Answers
  await answerRepository.save([
    { answer: "Arrakis", question: questions[0] },
    { answer: "Earth", question: questions[0] },
    { answer: "Mars", question: questions[0] },
    { answer: "Tatooine", question: questions[0] },
    { answer: "True", question: questions[1] },
    { answer: "False", question: questions[1] },
  ]);
  console.log("Answers created!");

  await dataSource.destroy();
  console.log("Seeding completed!");
}

seed().catch((err) => {
  console.error("Error seeding data:", err);
});
