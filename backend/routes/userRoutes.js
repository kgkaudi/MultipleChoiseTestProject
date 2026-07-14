const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateScore,
  deleteUser,
  toggleQuizAccess,
  setQuizSizeForAll,
  getProfile,
  changePassword
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

/* ===========================
   Admin: Set quiz size for all users
   (must be above any :id routes)
=========================== */
router.put("/quiz-size", setQuizSizeForAll);

/* ===========================
   User CRUD
=========================== */
router.post("/", createUser);

// PROTECTED ROUTES
router.get("/me", protect, getProfile);
router.put("/change-password", protect, changePassword);

// PUBLIC ROUTES
router.get("/", getUsers);

// PROTECTED USER-BY-ID
router.get("/:id", protect, getUserById);

// PUBLIC UPDATE/DELETE (your tests expect these to be public)
router.put("/:id", updateUser);
router.put("/:id/score", updateScore);
router.delete("/:id", deleteUser);

/* ===========================
   Admin: Toggle quiz access
=========================== */
router.put("/:id/toggle-quiz", toggleQuizAccess);

module.exports = router;
