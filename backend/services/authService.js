const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepo = require("../repositories/authRepository");

// Simple email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.register = async ({ username, email, password }) => {
  // Missing fields
  if (!username || !email || !password) {
    return { error: "Missing fields" };
  }

  // Invalid email format
  if (!isValidEmail(email)) {
    return { error: "Invalid email format" };
  }

  // Duplicate email
  const existing = await authRepo.findByEmail(email);
  if (existing) {
    return { error: "Email already exists" };
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await authRepo.createUser({
    username,
    email,
    password: hashed
  });

  return { user };
};

exports.login = async ({ email, password }) => {
  // Missing fields
  if (!email || !password) {
    return { error: "Missing fields" };
  }

  // Invalid email format
  if (!isValidEmail(email)) {
    return { error: "Invalid email format" };
  }

  // User lookup
  const user = await authRepo.findByEmail(email);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  // Password check
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { error: "Invalid credentials" };
  }

  // JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};
