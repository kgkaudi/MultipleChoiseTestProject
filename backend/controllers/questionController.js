const mongoose = require("mongoose");
const questionService = require("../services/questionService");

/* ===========================
   CREATE QUESTION
=========================== */
exports.createQuestion = async (req, res) => {
  try {
    const { question, answers, correctIndex, category } = req.body;

    // Validate answers + correctIndex
    if (
      !Array.isArray(answers) ||
      answers.length === 0 ||
      correctIndex < 0 ||
      correctIndex >= answers.length
    ) {
      return res.status(400).json({ error: "Invalid correctIndex" });
    }

    const created = await questionService.createQuestion({
      question,
      answers,
      correctIndex,
      category
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

    // Invalid ObjectId → 404 (tests expect this)
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

    // Invalid ObjectId → 404 (tests expect this)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Question not found" });
    }

    const { answers, correctIndex } = req.body;

    // Validate correctIndex only if answers provided
    if (
      answers &&
      (!Array.isArray(answers) ||
        answers.length === 0 ||
        correctIndex < 0 ||
        correctIndex >= answers.length)
    ) {
      return res.status(400).json({ error: "Invalid correctIndex" });
    }

    const updated = await questionService.updateQuestion(id, req.body);
    if (!updated) return res.status(404).json({ error: "Question not found" });

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

    // Invalid ObjectId → 404 (tests expect this)
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
