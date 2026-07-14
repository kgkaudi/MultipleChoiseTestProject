const User = require("../models/User");

exports.create = (data) => {
  const User = require("../models/User");
  return User.create(data);
};

exports.findAll = () => {
  const User = require("../models/User");
  return User.find();
};

exports.findById = (id) => {
  const User = require("../models/User");
  return User.findById(id);
};

exports.updateById = (id, data) => {
  const User = require("../models/User");
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = (id) => {
  const User = require("../models/User");
  return User.findByIdAndDelete(id);
};

exports.updateMany = (filter, data) => {
  const User = require("../models/User");
  return User.updateMany(filter, data);
};

exports.save = (user) => user.save();
