const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} = require("../controllers/questionController");

const { protect } = require("../middleware/authMiddleware");

// All question routes require authentication
router.post("/", protect, createQuestion);
router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;