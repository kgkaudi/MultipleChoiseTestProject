const User = require("../models/User");

exports.create = (data) => {
  return User.create(data);
};

exports.findAll = () => {
  return User.find();
};

exports.findById = (id) => {
  return User.findById(id);
};

exports.updateById = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteById = (id) => {
  return User.findByIdAndDelete(id);
};

exports.updateMany = (filter, data) => {
  return User.updateMany(filter, data);
};

exports.save = (user) => user.save();
