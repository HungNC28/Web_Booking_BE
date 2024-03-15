const User = require("../../models/user");
const Hotel = require("../../models/hotel");
const Room = require("../../models/room");
const Transaction = require("../../models/transaction");

// hàm get time
function GetTS(time) {
    const date = new Date(time);
    return date.getTime();
}

exports.dashboard = async (req, res) => {
    const user = await User.find();
    const transaction = await Transaction.find();
    const orders = transaction ? transaction.length : 0;
    let earnings = 0;
    for (let i = 0; i < transaction.length; i++) {
        earnings += Number(transaction[i].price);
    }

    const startDates = transaction.map((t) => t.start);

    // tìm ngày bắt đầu sớm nhất
    let earliestDate;
    for (const date of startDates) {
        const dateObject = new Date(date);
        if (!earliestDate || dateObject.getTime() < earliestDate.getTime()) {
            earliestDate = dateObject;
        }
    }

    const currentTime = new Date();
    const days =
        (currentTime.getTime() - new Date(earliestDate).getTime()) /
        (24 * 60 * 60 * 1000);
    const months = earliestDate.getMonth() + Math.floor(days / 30) || 1;
    const balance = earnings / months;

    res.json({ users: user.length, orders, earnings, balance });
};
