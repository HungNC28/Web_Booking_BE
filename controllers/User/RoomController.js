const Hotel = require("../../models/hotel");
const Room = require("../../models/room");
const Transactions = require("../../models/transaction");

// lấy list rooms
exports.RoomsList = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        console.log(error);
    }
};

// Tìm room theo Id
exports.getRoomById = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const result = await Room.findById(roomId);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// hàm get time
function GetTS(time) {
    const date = new Date(time);
    return date.getTime();
}

exports.RoomAvailable = async (req, res) => {
    const { date } = req.body;
    const hotel = await Hotel.findOne({ _id: req.params.hotelId });

    const start = GetTS(date[0].startDate);
    const end = GetTS(date[0].endDate);
    try {
        const arrRooms = await Room.find({});
        const arrTransaction = await Transactions.find({});

        // tìm transaction đã đc book
        const transaction = arrTransaction.filter(
            (t) => end <= GetTS(t.end) && start >= GetTS(t.start)
        );

        console.log(
            "2222",
            transaction.map((t) => t.roomArr).map((t) => t[0].room_id)
        );

        // tìm room chưa đc book
        const rooms = arrRooms.filter(
            (r) =>
                !transaction
                    .map((t) => t.roomArr)
                    .map((t) => t[0].room_id)
                    .some((t) => t.includes(r._id))
        );

        // tìm room có chứa hotelId hotel đó
        const roomsAvailable = [];
        for (let i = 0; i < hotel.rooms.length; i++) {
            for (let j = 0; j < rooms.length; j++) {
                if (rooms[j]._id.toString() == hotel.rooms[i].toString()) {
                    roomsAvailable.push(rooms[j]);
                }
            }
        }

        res.status(200).send(roomsAvailable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa room
exports.deleteRoom = async (req, res) => {
    try {
        const transactions = await Transactions.find();
        // check xem hotel có trong transaction hay không

        const check = transactions
            .map((t) => t.roomArr[0])
            .map((t) => t.room_id)
            .filter((t) => t.includes(req.params.roomId));

        if (check.length === 0) {
            await Room.findOneAndDelete({
                _id: req.params.roomId,
            });
            res.status(200).json({ message: "Delete success" });
        } else {
            res.status(400).json({ message: "Room đã có trong Transactions" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm room
exports.addRoom = async (req, res) => {
    const newRoom = {
        desc: req.body.desc,
        maxPeople: req.body.maxPeople,
        price: req.body.price,
        roomNumbers: req.body.roomNumbers,
        title: req.body.title,
    };
    try {
        const room = new Room(newRoom);
        await room.save();
        res.status(201).json({ message: "Thêm mới phòng thành công" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi khi thêm mới phòng" });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    const roomId = req.params.roomId;
    console.log("2222", req.body);
    const updateRoom = {
        desc: req.body.desc,
        maxPeople: req.body.maxPeople,
        price: req.body.price,
        roomNumbers: req.body.roomNumbers,
        title: req.body.title,
    };

    Room.findByIdAndUpdate(roomId, updateRoom)
        .then(res.status(201).json({ message: "Update thành công" }))
        .catch((err) => {
            console.log(err);
        });
};
