const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  category: { type: String, required: true }
});

module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);