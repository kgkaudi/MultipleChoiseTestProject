const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Question = require("../models/Question");

const MONGO_URI = "mongodb://localhost:27017/MultipleChoiceQuestionsTest";

// Shuffle answers and update correctIndex
function shuffleAnswers(questionObj) {
  const answers = questionObj.answers.map((a, i) => ({
    text: a,
    originalIndex: i
  }));

  // Fisher–Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  const newCorrectIndex = answers.findIndex(
    a => a.originalIndex === questionObj.correctIndex
  );

  return {
    answers: answers.map(a => a.text),
    correctIndex: newCorrectIndex
  };
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // --- ADMIN USER ---
    const adminEmail = "admin@quizapp.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      const admin = new User({
        username: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // --- REALISTIC QUESTIONS ---
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions < 20) {
      const realisticQuestions = [
        {
          question: "What is the capital city of Japan?",
          answers: ["Tokyo", "Kyoto", "Osaka", "Nagoya"],
          correctIndex: 0,
          difficulty: "easy",
          category: "geography"
        },
        {
          question: "Which planet is known as the Red Planet?",
          answers: ["Mars", "Jupiter", "Venus", "Saturn"],
          correctIndex: 0,
          difficulty: "easy",
          category: "science"
        },
        {
          question: "Who wrote the play 'Romeo and Juliet'?",
          answers: ["William Shakespeare", "Charles Dickens", "Leo Tolstoy", "Mark Twain"],
          correctIndex: 0,
          difficulty: "easy",
          category: "literature"
        },
        {
          question: "What is the chemical symbol for gold?",
          answers: ["Au", "Ag", "Go", "Gd"],
          correctIndex: 0,
          difficulty: "medium",
          category: "science"
        },
        {
          question: "Which country hosted the 2016 Summer Olympics?",
          answers: ["Brazil", "China", "UK", "Russia"],
          correctIndex: 0,
          difficulty: "medium",
          category: "sports"
        },
        {
          question: "What is the largest mammal on Earth?",
          answers: ["Blue Whale", "Elephant", "Hippopotamus", "Giraffe"],
          correctIndex: 0,
          difficulty: "easy",
          category: "biology"
        },
        {
          question: "In computing, what does 'CPU' stand for?",
          answers: ["Central Processing Unit", "Computer Power Utility", "Core Performance Unit", "Central Program Unit"],
          correctIndex: 0,
          difficulty: "medium",
          category: "technology"
        },
        {
          question: "Which gas do plants absorb from the atmosphere?",
          answers: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
          correctIndex: 0,
          difficulty: "easy",
          category: "science"
        },
        {
          question: "What is the hardest natural substance on Earth?",
          answers: ["Diamond", "Quartz", "Graphite", "Obsidian"],
          correctIndex: 0,
          difficulty: "medium",
          category: "science"
        },
        {
          question: "Who painted the Mona Lisa?",
          answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Van Gogh"],
          correctIndex: 0,
          difficulty: "medium",
          category: "art"
        },
        {
          question: "Which ocean is the largest?",
          answers: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
          correctIndex: 0,
          difficulty: "easy",
          category: "geography"
        },
        {
          question: "What is the square root of 144?",
          answers: ["12", "14", "10", "16"],
          correctIndex: 0,
          difficulty: "easy",
          category: "math"
        },
        {
          question: "Which element has the atomic number 1?",
          answers: ["Hydrogen", "Helium", "Oxygen", "Carbon"],
          correctIndex: 0,
          difficulty: "easy",
          category: "science"
        },
        {
          question: "What year did World War II end?",
          answers: ["1945", "1939", "1942", "1950"],
          correctIndex: 0,
          difficulty: "medium",
          category: "history"
        },
        {
          question: "Which instrument has 88 keys?",
          answers: ["Piano", "Guitar", "Violin", "Flute"],
          correctIndex: 0,
          difficulty: "easy",
          category: "music"
        },
        {
          question: "What is the largest desert in the world?",
          answers: ["Sahara", "Gobi", "Arabian", "Kalahari"],
          correctIndex: 0,
          difficulty: "medium",
          category: "geography"
        },
        {
          question: "Which blood type is known as the universal donor?",
          answers: ["O Negative", "A Positive", "B Negative", "AB Positive"],
          correctIndex: 0,
          difficulty: "hard",
          category: "biology"
        },
        {
          question: "What is the speed of light?",
          answers: ["299,792 km/s", "150,000 km/s", "1,000 km/s", "500,000 km/s"],
          correctIndex: 0,
          difficulty: "hard",
          category: "science"
        },
        {
          question: "Who discovered penicillin?",
          answers: ["Alexander Fleming", "Marie Curie", "Isaac Newton", "Albert Einstein"],
          correctIndex: 0,
          difficulty: "medium",
          category: "science"
        },
        {
          question: "Which country has the most pyramids?",
          answers: ["Sudan", "Egypt", "Mexico", "Peru"],
          correctIndex: 0,
          difficulty: "hard",
          category: "history"
        }
      ];

      // Shuffle answers for each question
      const finalQuestions = realisticQuestions.map(q => {
        const shuffled = shuffleAnswers(q);
        return {
          ...q,
          answers: shuffled.answers,
          correctIndex: shuffled.correctIndex
        };
      });

      await Question.insertMany(finalQuestions);
      console.log("20 realistic questions added with randomized answers");
    } else {
      console.log("Questions already exist");
    }

    console.log("Migration completed successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Migration failed:", err);
    mongoose.connection.close();
  }
}

seedDatabase();
