const User = require("../models/User");

/* ===========================
   FIND BY EMAIL
=========================== */
exports.findByEmail = (email) => {
  if (!email || typeof email !== "string") return null;
  return User.findOne({ email: email.toLowerCase() });
};

/* ===========================
   FIND BY USERNAME
=========================== */
exports.findByUsername = (username) => {
  return User.findOne({ username });
};

/* ===========================
   CREATE USER
=========================== */
exports.createUser = (data) => {
  // Normalize email before saving
  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  return User.create(data);
};
