const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateScore,
  updateRole,
  deleteUser,
  toggleQuizAccess,
  setQuizSizeForAll,
  getProfile,
  changePassword
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ===========================
   Admin: Set quiz size for all users
=========================== */
router.put("/quiz-size", protect, adminOnly, setQuizSizeForAll);

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

// PUBLIC ROLE
router.put("/:id/role", protect, adminOnly, updateRole);

// PUBLIC UPDATE/DELETE
router.put("/:id", updateUser);
router.put("/:id/score", updateScore);
router.delete("/:id", deleteUser);

/* ===========================
   Admin: Toggle quiz access
=========================== */
router.put("/:id/toggle-quiz", protect, adminOnly, toggleQuizAccess);

module.exports = router;
