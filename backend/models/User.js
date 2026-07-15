const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    /* ===========================
       QUIZ FIELDS
    ============================ */
    lastScore: { type: Number, default: 0 },
    canTakeQuiz: { type: Boolean, default: true },
    dateCompleted: { type: Date },
    quizSize: { type: Number, default: 10 },

    /* ===========================
       ROLE
    ============================ */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    /* ===========================
       OPTIONAL AVATAR
    ============================ */
    avatar: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

/* ===========================
   METHODS
=========================== */
userSchema.methods.markQuizCompleted = function (score) {
  this.lastScore = score;
  this.dateCompleted = new Date();
  this.canTakeQuiz = false;
  return this.save();
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
