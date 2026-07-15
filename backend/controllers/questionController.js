const mongoose = require("mongoose");
const questionService = require("../services/questionService");

/* ===========================
   CREATE QUESTION
=========================== */
exports.createQuestion = async (req, res) => {
  try {
    const { question, answers, correctIndex, category, difficulty } = req.body;

    // Validate question
    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ error: "Question text is required" });
    }

    // Validate answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Answers must be a non-empty array" });
    }

    // Normalize answers to exactly 4
    let normalizedAnswers = [...answers];
    if (normalizedAnswers.length > 4) normalizedAnswers = normalizedAnswers.slice(0, 4);
    while (normalizedAnswers.length < 4) normalizedAnswers.push("");

    // Validate correctIndex
    const index = Number(correctIndex);
    if (isNaN(index) || index < 0 || index >= normalizedAnswers.length) {
      return res.status(400).json({ error: "Invalid correctIndex" });
    }

    // difficulty REQUIRED
    if (difficulty === undefined) {
      return res.status(400).json({ error: "Difficulty is required" });
    }

    const validDiff = ["easy", "medium", "hard"];
    if (!validDiff.includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty value" });
    }

    // Validate category if provided
    if (category !== undefined) {
      if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({ error: "Category cannot be empty" });
      }
    }

    const created = await questionService.createQuestion({
      question,
      answers: normalizedAnswers,
      correctIndex: index,
      category,
      difficulty,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ ALL QUESTIONS
=========================== */
exports.getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions();
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ SINGLE QUESTION
=========================== */
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = await questionService.getQuestionById(id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    return res.status(200).json(question);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE QUESTION
=========================== */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check existence BEFORE validating body
    const exists = await questionService.getQuestionById(id);
    if (!exists) {
      return res.status(404).json({ error: "Question not found" });
    }

    const { question, answers, correctIndex, difficulty, category } = req.body;

    // Validate question text if provided
    if (question !== undefined) {
      if (typeof question !== "string" || question.trim() === "") {
        return res.status(400).json({ error: "Question text cannot be empty" });
      }
    }

    // Validate answers if provided
    let normalizedAnswers;
    if (answers !== undefined) {
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Answers must be a non-empty array" });
      }

      // Normalize answers to exactly 4
      normalizedAnswers = [...answers];
      if (normalizedAnswers.length > 4) normalizedAnswers = normalizedAnswers.slice(0, 4);
      while (normalizedAnswers.length < 4) normalizedAnswers.push("");

      if (correctIndex === undefined) {
        return res.status(400).json({ error: "Invalid correctIndex" });
      }

      const index = Number(correctIndex);
      if (isNaN(index) || index < 0 || index >= normalizedAnswers.length) {
        return res.status(400).json({ error: "Invalid correctIndex" });
      }

      req.body.correctIndex = index;
    }

    // difficulty REQUIRED
    if (difficulty === undefined) {
      return res.status(400).json({ error: "Difficulty is required" });
    }

    const validDiff = ["easy", "medium", "hard"];
    if (!validDiff.includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty value" });
    }

    // Validate category if provided
    if (category !== undefined) {
      if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({ error: "Category cannot be empty" });
      }
    }

    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answers !== undefined) updateData.answers = normalizedAnswers;
    if (correctIndex !== undefined) updateData.correctIndex = req.body.correctIndex;
    updateData.difficulty = difficulty; // always required
    if (category !== undefined) updateData.category = category;

    const updated = await questionService.updateQuestion(id, updateData);

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   DELETE QUESTION
=========================== */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Question not found" });
    }

    const deleted = await questionService.deleteQuestion(id);
    if (!deleted) return res.status(404).json({ error: "Question not found" });

    return res.status(200).json({ message: "Question deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
