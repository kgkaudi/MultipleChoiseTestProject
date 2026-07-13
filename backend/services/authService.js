const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepo = require("../repositories/authRepository");

exports.register = async ({ username, email, password }) => {
  const existing = await authRepo.findByEmail(email);
  if (existing) return { error: "Email already exists" };

  const hashed = await bcrypt.hash(password, 10);

  const user = await authRepo.createUser({
    username,
    email,
    password: hashed
  });

  return { user };
};

exports.login = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email);
  if (!user) return { error: "Invalid credentials" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Invalid credentials" };

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};
