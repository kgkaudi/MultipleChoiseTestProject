const User = require("../models/User");

exports.create = (data) => User.create(data);
exports.findAll = () => User.find();
exports.findById = (id) => User.findById(id);
exports.updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true });
exports.deleteById = (id) => User.findByIdAndDelete(id);
exports.updateMany = (filter, data) => User.updateMany(filter, data);
exports.save = (user) => user.save();
