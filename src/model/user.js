const mongoose = require("mongoose");
const config = require('config');
const databaseCollection = config.database.users_collection;

const userSchema = new mongoose.Schema({
  user_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema, databaseCollection);