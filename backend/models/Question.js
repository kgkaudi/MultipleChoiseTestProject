const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },

  answers: {
    type: [String],
    required: [true, "Answers are required"],
    default: ["", "", "", ""],
    set: function (value) {
      // Reject non-array input BEFORE Mongoose casts it
      if (!Array.isArray(value)) {
        throw new mongoose.Error.ValidationError(
          new mongoose.Error.ValidatorError({
            path: "answers",
            message: "Answers must be an array",
          })
        );
      }

      let normalized = [...value];
      if (normalized.length > 4) normalized = normalized.slice(0, 4);
      while (normalized.length < 4) normalized.push("");
      return normalized;
    },
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 4;
      },
      message: "Answers must contain exactly 4 items",
    },
  },

  correctIndex: {
    type: Number,
    required: [true, "correctIndex is required"],
    validate: {
      validator: function (v) {
        const arr = Array.isArray(this.answers) ? this.answers : [];
        return Number.isInteger(v) && v >= 0 && v < arr.length;
      },
      message: "Invalid correctIndex5"
    }
  },

  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Invalid difficulty value",
    },
    default: "easy",
  },

  category: {
    type: String,
    trim: true,
  },
});

module.exports =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
