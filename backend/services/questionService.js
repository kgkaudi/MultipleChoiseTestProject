const questionRepo = require("../repositories/questionRepository");

/* ===========================
   CREATE QUESTION
=========================== */
exports.createQuestion = (data) => {
  return questionRepo.create(data);
};

/* ===========================
   READ ALL QUESTIONS
=========================== */
exports.getQuestions = () => {
  return questionRepo.findAll();
};

/* ===========================
   READ SINGLE QUESTION
=========================== */
exports.getQuestionById = (id) => {
  return questionRepo.findById(id);
};

/* ===========================
   UPDATE QUESTION
=========================== */
exports.updateQuestion = async (id, data) => {
  // Ensure validators run on updated data
  return questionRepo.updateById(id, data, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

/* ===========================
   DELETE QUESTION
=========================== */
exports.deleteQuestion = (id) => {
  return questionRepo.deleteById(id);
};
