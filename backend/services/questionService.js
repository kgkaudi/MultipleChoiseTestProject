const questionRepo = require("../repositories/questionRepository");

exports.createQuestion = async (data) => {
  return await questionRepo.create(data);
};

exports.getQuestions = async () => {
  return await questionRepo.findAll();
};

exports.getQuestionById = async (id) => {
  return await questionRepo.findById(id);
};

exports.updateQuestion = async (id, data) => {
  return await questionRepo.updateById(id, data);
};

exports.deleteQuestion = async (id) => {
  return await questionRepo.deleteById(id);
};
