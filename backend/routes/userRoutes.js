const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateScore,
  deleteUser
} = require("../controllers/userController");

const User = require("../models/User");

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
router.put("/:id/toggle-quiz", async (req, res) => {
  try {
    const { canTakeQuiz } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.canTakeQuiz = canTakeQuiz;
    await user.save();

    res.json({
      success: true,
      userId: user._id,
      canTakeQuiz: user.canTakeQuiz
    });
  } catch (err) {
    console.error("Toggle quiz error:", err);
    res.status(500).json({ error: "Failed to update quiz access" });
  }
});

module.exports = router;
