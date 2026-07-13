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
  setQuizSizeForAll
} = require("../controllers/userController");

/* ===========================
   Admin: Set quiz size for all users
   (must be above any :id routes)
=========================== */
router.put("/quiz-size", setQuizSizeForAll);

/* ===========================
   User CRUD
=========================== */
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/score", updateScore);
router.delete("/:id", deleteUser);

/* ===========================
   Admin: Toggle quiz access
=========================== */
router.put("/:id/toggle-quiz", toggleQuizAccess);

module.exports = router;
