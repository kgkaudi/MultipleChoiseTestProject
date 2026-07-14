const Question = require("../models/Question");

exports.create = (data) => {
  const Question = require("../models/Question");
  return Question.create(data);
};

exports.findAll = () => {
  const Question = require("../models/Question");
  return Question.find();
};

exports.findById = (id) => {
  const Question = require("../models/Question");
  return Question.findById(id);
};

exports.updateById = (id, data) => {
  const Question = require("../models/Question");
  return Question.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = (id) => {
  const Question = require("../models/Question");
  return Question.findByIdAndDelete(id);
};
