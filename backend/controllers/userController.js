const userService = require("../services/userService");

/* ===========================
   CREATE USER
=========================== */
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ ALL USERS
=========================== */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   READ SINGLE USER
=========================== */
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE USER
=========================== */
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===========================
   UPDATE SCORE
=========================== */
exports.updateScore = async (req, res) => {
  try {
    const user = await userService.updateScore(
      req.params.id,
      req.body.lastScore,
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      message: "Score updated and quiz access locked.",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update score" });
  }
};

/* ===========================
   DELETE USER
=========================== */
exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    res.json({ message: `Quiz size set to ${quizSize} for all users.` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   ADMIN: Toggle quiz access
=========================== */
exports.toggleQuizAccess = async (req, res) => {
  try {
    const user = await userService.toggleQuizAccess(
      req.params.id,
      req.body.canTakeQuiz,
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      userId: user._id,
      canTakeQuiz: user.canTakeQuiz,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quiz access" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json({
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      canTakeQuiz: user.canTakeQuiz,
      quizSize: user.quizSize,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { current, new: newPassword } = req.body;
    const result = await userService.changePassword(
      req.user.id,
      current,
      newPassword
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
