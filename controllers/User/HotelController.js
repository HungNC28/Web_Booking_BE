const Hotel = require("../../models/hotel");
const Room = require("../../models/room");
const Transactions = require("../../models/transaction");

// lấy list hotel
exports.HotelList = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        console.log(error);
    }
};

// tìm khách sạn theo thành phố
async function findByCity(city) {
    if (city) {
        const hotels = await Hotel.find({ city: { $in: city } });
        return hotels.length;
    } else {
        return await Hotel.find({});
    }
}

// tìm khách sạn theo loại
async function findByType(type) {
    if (type) {
        const hotels = await Hotel.find({ type: type });
        return hotels.length;
    } else {
        return await Hotel.find({});
    }
}

// Số lượng các khách sạn theo khu vực: Hà Nội, HCM và Đà Nẵng.
exports.HotelCountByCity = async (req, res) => {
    try {
        const result = [
            {
                city: "Ha Noi",
                imgUrl: "HaNoi.jpg",
                amount: await findByCity("Ha Noi"),
            },
            {
                city: "Ho Chi Minh",
                imgUrl: "HCM.jpg",
                amount: await findByCity("Ho Chi Minh"),
            },
            {
                city: "Da Nang",
                imgUrl: "DaNang.jpg",
                amount: await findByCity("Da Nang"),
            },
        ];
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Số lượng khách sạn theo loại
exports.HotelCountByType = async (req, res) => {
    try {
        const result = [
            {
                type: "Hotel",
                imgUrl: "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
                amount: await findByType("hotel"),
            },
            {
                type: "Apartments",
                imgUrl: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
                amount: await findByType("apartments"),
            },
            {
                type: "Resorts",
                imgUrl: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
                amount: await findByType("resorts"),
            },
            {
                type: "Villas",
                imgUrl: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
                amount: await findByType("villas"),
            },
            {
                type: "Cabins",
                imgUrl: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
                amount: await findByType("cabins"),
            },
        ];
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Top 3 khách sạn rating cao nhất
exports.TopRatingHotel = async (req, res) => {
    try {
        const topRatingHotel = (await Hotel.find().sort({ rating: -1 })).slice(
            0,
            3
        );
        res.status(200).send(topRatingHotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// hàm get time
function GetTS(time) {
    const date = new Date(time);
    return date.getTime();
}

// Search khách sạn
exports.SearchHotelByFilter = async (req, res) => {
    const { destination, date, options } = req.body;
    const start = GetTS(date[0].startDate);
    const end = GetTS(date[0].endDate);
    try {
        const arrHotels = await Hotel.find({});
        const arrRooms = await Room.find({});
        const arrTransaction = await Transactions.find({});

        // tìm khách sạn theo tên vùng
        const hotelsByCity = arrHotels.filter(
            (item) => item.city.toLowerCase() === destination.toLowerCase()
        );

        // tìm transaction đã đc book
        const transaction = arrTransaction.filter(
            (t) => end <= GetTS(t.end) && start >= GetTS(t.start)
        );

        // tìm room chưa đc book
        const rooms = arrRooms.filter(
            (r) =>
                !transaction.some((t) =>
                    t.roomArr.map((r) => r.room_id).includes(r._id)
                )
        );

        const rooms_id = rooms.map((r) => r._id);

        const hotels = hotelsByCity.filter((h) => {
            let count = 0;
            h.rooms.forEach((r) => {
                if (rooms_id.toString().includes(r)) count++;
            });

            // tìm khách sạn có đủ số phòng
            if (+count >= +options.room) return h;
        });

        res.status(200).send(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tìm khách sạn theo Id
exports.getHotelById = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const result = await Hotel.findById(hotelId);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa khách sạn
exports.deleteHotel = async (req, res) => {
    try {
        const transactions = await Transactions.find();

        // check xem hotel có trong transaction hay không
        const check = transactions
            .map((t) => t.hotelId)
            .includes(req.params.hotelId);

        if (check) {
            res.status(400).json({ message: "Hotel đã có trong Transactions" });
        } else {
            await Hotel.findOneAndDelete({
                _id: req.params.hotelId,
            });
            res.status(200).json({ message: "Delete success" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// thêm khách sạn
exports.addHotel = async (req, res) => {
    const newHotel = {
        name: req.body.name,
        type: req.body.type,
        city: req.body.city,
        address: req.body.address,
        distance: req.body.distance,
        title: req.body.title,
        desc: req.body.desc,
        cheapestPrice: req.body.cheapestPrice,
        photos: req.body.photos,
        featured: req.body.featured,
        rooms: req.body.rooms,
    };
    try {
        const hotel = new Hotel(newHotel);
        await hotel.save();
        res.status(201).json({ message: "Thêm mới khách sạn thành công" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi khi thêm mới khách sạn" });
    }
};

// Update khách sạn
exports.updateHotel = async (req, res) => {
    const hotelId = req.params.hotelId;
    const updateHotel = {
        name: req.body.name,
        type: req.body.type,
        city: req.body.city,
        address: req.body.address,
        distance: req.body.distance,
        title: req.body.title,
        desc: req.body.desc,
        cheapestPrice: req.body.cheapestPrice,
        photos: req.body.photos,
        featured: req.body.featured,
        rooms: req.body.rooms,
    };
    Hotel.findByIdAndUpdate(hotelId, updateHotel)
        .then(res.status(201).json({ message: "Update thành công" }))
        .catch((err) => {
            console.log(err);
        });
};
