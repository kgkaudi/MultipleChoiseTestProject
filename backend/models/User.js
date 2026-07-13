const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Quiz tracking
    lastScore: { type: Number, default: 0 },
    canTakeQuiz: { type: Boolean, default: true },
    dateCompleted: { type: Date },

    // Role management
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// Optional helper: mark quiz completion
userSchema.methods.markQuizCompleted = function (score) {
  this.lastScore = score;
  this.dateCompleted = new Date();
  this.canTakeQuiz = false;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
