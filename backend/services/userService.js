const userRepo = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

/* ===========================
   CREATE USER
=========================== */
exports.createUser = async (data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await userRepo.create(data);
};

/* ===========================
   READ USERS
=========================== */
exports.getUsers = async () => {
  return await userRepo.findAll();
};

exports.getUserById = async (id) => {
  return await userRepo.findById(id);
};

/* ===========================
   UPDATE USER
=========================== */
exports.updateUser = async (id, data) => {
  return await userRepo.updateById(id, data);
};

/* ===========================
   UPDATE ROLE (ADMIN)
=========================== */
exports.updateRole = async (id, role) => {
  return await userRepo.updateById(id, { role });
};

/* ===========================
   UPDATE SCORE
=========================== */
exports.updateScore = async (id, lastScore) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  user.lastScore = lastScore;
  user.dateCompleted = new Date();
  user.canTakeQuiz = false;

  await user.save();
  return user;
};

/* ===========================
   DELETE USER
=========================== */
exports.deleteUser = async (id) => {
  return await userRepo.deleteById(id);
};

/* ===========================
   ADMIN: Set quiz size for all users
=========================== */
exports.setQuizSizeForAll = async (quizSize) => {
  return await userRepo.updateMany({}, { quizSize });
};

/* ===========================
   ADMIN: Toggle quiz access
=========================== */
exports.toggleQuizAccess = async (id, canTakeQuiz) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  user.canTakeQuiz = canTakeQuiz;
  await user.save();
  return user;
};

/* ===========================
   GET PROFILE
=========================== */
exports.getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

/* ===========================
   CHANGE PASSWORD
=========================== */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Incorrect current password");

  user.password = await bcrypt.hash(newPassword, 10);
  await userRepo.save(user);

  return { message: "Password updated successfully" };
};