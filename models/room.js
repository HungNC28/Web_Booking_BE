const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  maxPeople: Number,
  desc: String,
  roomNumbers: [Number],
});

module.exports = mongoose.model("Room", roomSchema);
