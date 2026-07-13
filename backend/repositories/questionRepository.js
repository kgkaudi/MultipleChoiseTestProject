const Question = require("../models/Question");

exports.create = (data) => Question.create(data);
exports.findAll = () => Question.find();
exports.findById = (id) => Question.findById(id);
exports.updateById = (id, data) =>
  Question.findByIdAndUpdate(id, data, { new: true });
exports.deleteById = (id) => Question.findByIdAndDelete(id);
