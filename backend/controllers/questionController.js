const mongoose = require("mongoose");
const questionService = require("../services/questionService");

/* ===========================
   CREATE QUESTION
=========================== */
exports.createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    return res.status(201).json(question);
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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ error: "Question not found" });

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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ error: "Question not found" });

    const question = await questionService.updateQuestion(id, req.body);
    if (!question) return res.status(404).json({ error: "Question not found" });

    return res.status(200).json(question);
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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ error: "Question not found" });

    const question = await questionService.deleteQuestion(id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    return res.status(200).json({ message: "Question deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
