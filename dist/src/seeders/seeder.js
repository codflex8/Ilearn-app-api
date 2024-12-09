"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/seeds/SeedData.ts
const dataSource_1 = require("../models/dataSource");
const User_model_1 = require("../models/User.model");
const Categories_model_1 = require("../models/Categories.model");
const Books_model_1 = require("../models/Books.model");
const ChatBot_model_1 = require("../models/ChatBot.model");
const Quiz_model_1 = require("../models/Quiz.model");
const Questions_model_1 = require("../models/Questions.model");
const Answers_model_1 = require("../models/Answers.model");
const AuthValidator_1 = require("../utils/validators/AuthValidator");
const QuizValidator_1 = require("../utils/validators/QuizValidator");
const QuizValidator_2 = require("../utils/validators/QuizValidator");
const bcryptjs_1 = require("bcryptjs");
async function seed() {
    const dataSource = await dataSource_1.dataSource.initialize();
    const userRepository = dataSource.getRepository(User_model_1.User);
    const categoryRepository = dataSource.getRepository(Categories_model_1.Category);
    const bookRepository = dataSource.getRepository(Books_model_1.Book);
    const chatbotRepository = dataSource.getRepository(ChatBot_model_1.Chatbot);
    const quizRepository = dataSource.getRepository(Quiz_model_1.Quiz);
    const questionRepository = dataSource.getRepository(Questions_model_1.Question);
    const answerRepository = dataSource.getRepository(Answers_model_1.Answer);
    console.log("Seeding data...");
    // Step 1: Create Users with realistic data
    const users = await userRepository.save([
        {
            email: "ibrahim@gmail.com",
            phoneNumber: "1234567890",
            username: "ibrahim",
            password: await (0, bcryptjs_1.hash)("123456", 10),
            birthDate: new Date("1990-02-10"),
            gender: AuthValidator_1.GenderEnum.FEMALE,
            imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            email: "ahmed@gmail.com",
            phoneNumber: "1234567891",
            username: "bob",
            password: await (0, bcryptjs_1.hash)("123456", 10),
            birthDate: new Date("1988-05-22"),
            gender: AuthValidator_1.GenderEnum.MALE,
            imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            email: "carol.doe@example.com",
            phoneNumber: "1234567892",
            username: "carol",
            password: await (0, bcryptjs_1.hash)("securePass3", 10),
            birthDate: new Date("1995-08-15"),
            gender: AuthValidator_1.GenderEnum.FEMALE,
            imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
            email: "dave.williams@example.com",
            phoneNumber: "1234567893",
            username: "dave",
            password: await (0, bcryptjs_1.hash)("securePass4", 10),
            birthDate: new Date("1985-03-10"),
            gender: AuthValidator_1.GenderEnum.MALE,
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
            questionsType: QuizValidator_1.QuestionType.MultiChoic,
            quizLevel: QuizValidator_2.QuizLevel.Ease,
            user: users[0],
            books: [books[0]],
        },
        {
            name: "Middle-earth Lore",
            mark: 15,
            questionsType: QuizValidator_1.QuestionType.TrueFalse,
            quizLevel: QuizValidator_2.QuizLevel.Medium,
            user: users[1],
            books: [books[1]],
        },
    ]);
    console.log("Quizzes created!");
    // Step 6: Create Questions
    const questions = await questionRepository.save([
        {
            question: "What is the desert planet in Dune?",
            type: QuizValidator_1.QuestionType.MultiChoic,
            quiz: quizzes[0],
            correctAnswerIndex: 0,
        },
        {
            question: "Is Bilbo Baggins a wizard?",
            type: QuizValidator_1.QuestionType.TrueFalse,
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
//# sourceMappingURL=seeder.js.map