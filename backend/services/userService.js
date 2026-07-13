const userRepo = require("../repositories/userRepository");

exports.createUser = async (data) => {
  return await userRepo.create(data);
};

exports.getUsers = async () => {
  return await userRepo.findAll();
};

exports.getUserById = async (id) => {
  return await userRepo.findById(id);
};

exports.updateUser = async (id, data) => {
  return await userRepo.updateById(id, data);
};

exports.updateScore = async (id, lastScore) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  user.lastScore = lastScore;
  user.dateCompleted = new Date();
  user.canTakeQuiz = false;

  await user.save();
  return user;
};

exports.deleteUser = async (id) => {
  return await userRepo.deleteById(id);
};

exports.setQuizSizeForAll = async (quizSize) => {
  return await userRepo.updateMany({}, { quizSize });
};

exports.toggleQuizAccess = async (id, canTakeQuiz) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  user.canTakeQuiz = canTakeQuiz;
  await user.save();
  return user;
};
