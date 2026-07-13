const questionService = require("../services/questionService");

/* ===========================
   CREATE QUESTION
=========================== */
exports.createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ ALL QUESTIONS
=========================== */
exports.getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions();
    res.json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ SINGLE QUESTION
=========================== */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE QUESTION
=========================== */
exports.updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(
      req.params.id,
      req.body,
    );
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   DELETE QUESTION
=========================== */
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await questionService.deleteQuestion(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
