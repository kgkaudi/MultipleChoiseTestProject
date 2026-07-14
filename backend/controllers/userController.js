const userService = require("../services/userService");
const mongoose = require("mongoose");

/* ===========================
   CREATE USER
=========================== */
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ ALL USERS
=========================== */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ SINGLE USER
=========================== */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE USER
=========================== */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = await userService.updateUser(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE SCORE
=========================== */
exports.updateScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = await userService.updateScore(id, req.body.lastScore);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Score updated and quiz access locked.",
      user: updated
    });

  } catch (err) {
    return res.status(500).json({ error: "Failed to update score" });
  }
};

/* ===========================
   DELETE USER
=========================== */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   ADMIN: Set quiz size for all users
=========================== */
exports.setQuizSizeForAll = async (req, res) => {
  try {
    const { quizSize } = req.body;

    if (!quizSize || isNaN(quizSize)) {
      return res.status(400).json({ message: "Invalid quiz size" });
    }

    await userService.setQuizSizeForAll(quizSize);

    return res.status(200).json({
      message: `Quiz size set to ${quizSize} for all users.`
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ADMIN: Toggle quiz access
=========================== */
exports.toggleQuizAccess = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = await userService.toggleQuizAccess(id, req.body.canTakeQuiz);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userId: updated._id,
      canTakeQuiz: updated.canTakeQuiz
    });

  } catch (err) {
    return res.status(500).json({ error: "Failed to update quiz access" });
  }
};

/* ===========================
   GET PROFILE
=========================== */
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);

    return res.status(200).json({
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      canTakeQuiz: user.canTakeQuiz,
      quizSize: user.quizSize
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   CHANGE PASSWORD
=========================== */
exports.changePassword = async (req, res) => {
  try {
    const { current, new: newPassword } = req.body;

    const result = await userService.changePassword(
      req.user.id,
      current,
      newPassword
    );

    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
