const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: { type: String, requied: true },
    type: { type: String, requied: true },
    city: String,
    address: String,
    distance: String,
    photos: [String],
    desc: String,
    title: String,
    rating: Number,
    featured: Boolean,
    cheapestPrice: Number,
    rooms: [{ type: String, ref: "Room", requied: true }],
});

module.exports = mongoose.model("Hotel", hotelSchema);
