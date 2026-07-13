const Question = require("../models/Question");

// CREATE QUESTION
exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL QUESTIONS
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ SINGLE QUESTION
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE QUESTION
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE QUESTION
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
