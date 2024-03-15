const Hotel = require("../../models/hotel");
const Room = require("../../models/room");
const Transactions = require("../../models/transaction");

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const formattedDate = formatter.format(date);
    return formattedDate;
};

const findDate = (start, end) => {
    return `${start} - ${end}`;
};

exports.TransactionAdd = async (req, res) => {
    const { user, hotelId, roomArr, date, totalBill, payment } = req.body;

    // hàm get time
    function GetTS(time) {
        const date = new Date(time);
        return date.getTime();
    }

    const setStatus = (start, end) => {
        const currentTime = Date.now();
        if (currentTime < GetTS(start)) {
            return "Booked";
        } else if (GetTS(start) <= currentTime && currentTime <= GetTS(end)) {
            return "Checkin";
        } else {
            return "Checkout";
        }
    };

    const newTransaction = {
        user,
        hotelId,
        roomArr,
        start: date[0].startDate,
        end: date[0].endDate,
        price: totalBill,
        payment,
        status: setStatus(date[0].startDate, date[0].endDate),
    };

    try {
        const transactions = new Transactions(newTransaction);
        await transactions.save();
        res.status(201).json("Success");
    } catch (error) {
        console.log(error);
    }
};

exports.userTransactions = async (req, res) => {
    //find transactions by username
    const transactionsList = await Transactions.find({ user: req.query.user });
    const hotel = await Hotel.find({});

    const result = transactionsList.map((trans, id) => {
        const hotelName = hotel
            .filter((h) => h._id == trans.hotelId)
            .map((h) => h.name);
        console.log("222", hotelName);

        return {
            ...trans,
            id: id + 1,
            date: findDate(formatDate(trans.start), formatDate(trans.end)),
            name: hotelName,
        };
    });

    res.json(result);
};

exports.lastest = async (req, res) => {
    const lastestTrans = (await Transactions.find()).reverse();
    const hotel = await Hotel.find({});

    const result = lastestTrans.map((trans) => {
        const hotelName = hotel
            .filter((h) => h._id == trans.hotelId)
            .map((h) => h.name);
        return {
            ...trans,
            date: findDate(formatDate(trans.start), formatDate(trans.end)),
            name: hotelName,
        };
    });

    res.json(result);
};
