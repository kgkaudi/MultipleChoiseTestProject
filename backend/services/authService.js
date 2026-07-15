const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepo = require("../repositories/authRepository");

// Simple email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ===========================
   REGISTER
=========================== */
exports.register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    return { error: "Missing fields" };
  }

  if (!isValidEmail(email)) {
    return { error: "Invalid email format" };
  }

  // Check duplicate email
  const existingEmail = await authRepo.findByEmail(email);
  if (existingEmail) {
    return { error: "Email already exists" };
  }

  // Check duplicate username
  const existingUsername = await authRepo.findByUsername(username);
  if (existingUsername) {
    return { error: "Username already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await authRepo.createUser({
    username,
    email,
    password: hashed
  });

  return { user };
};

/* ===========================
   LOGIN (email OR username)
=========================== */
exports.login = async ({ identifier, password }) => {
  if (!identifier || !password) {
    return { error: "Missing fields" };
  }

  // Try email first
  let user = null;

  if (isValidEmail(identifier)) {
    user = await authRepo.findByEmail(identifier);
  } else {
    // Otherwise treat as username
    user = await authRepo.findByUsername(identifier);
  }

  if (!user) {
    return { error: "Invalid credentials" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { error: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};
