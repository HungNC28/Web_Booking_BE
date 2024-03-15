const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user: { type: String, ref: "User", required: true },
    hotelId: { type: String, ref: "Hotel", required: true },
    roomArr: { type: [Object] },
    start: { type: String, required: true },
    end: { type: String, required: true },
    price: { type: Number, required: true },
    payment: { type: String, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
