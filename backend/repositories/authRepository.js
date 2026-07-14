const User = require("../models/User");

exports.findByEmail = (email) => {
  const User = require("../models/User");
  return User.findOne({ email });
};

exports.createUser = (data) => {
  const User = require("../models/User");
  return User.create(data);
};