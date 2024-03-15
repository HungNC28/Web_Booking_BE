const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: String,
  phoneNumber: Number,
  email: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model("User", userSchema);
