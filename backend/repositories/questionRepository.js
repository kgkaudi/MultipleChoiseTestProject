const Question = require("../models/Question");

/* ===========================
   CREATE
=========================== */
exports.create = (data) => {
  return Question.create(data);
};

/* ===========================
   FIND ALL
=========================== */
exports.findAll = () => {
  return Question.find().lean();
};

/* ===========================
   FIND BY ID
=========================== */
exports.findById = (id) => {
  return Question.findById(id).lean();
};

/* ===========================
   UPDATE BY ID
=========================== */
exports.updateById = async (id, data) => {
  try {
    return await Question.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
      context: "query",
    });
  } catch (err) {
    // Fallback to manual save if validation fails
    const question = await Question.findById(id);
    if (!question) throw err;
    Object.assign(question, data);
    return question.save();
  }
};

/* ===========================
   DELETE BY ID
=========================== */
exports.deleteById = (id) => {
  return Question.findByIdAndDelete(id).lean();
};
