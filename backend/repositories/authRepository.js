const User = require("../models/User");

exports.findByEmail = (email) => User.findOne({ email });
exports.createUser = (data) => User.create(data);
