const express = require("express");
const router = express.Router();

const HotelController = require("../controllers/User/HotelController");

router.get("/hotels/hotel-count-by-city", HotelController.HotelCountByCity);
router.get("/hotels/hotel-count-by-type", HotelController.HotelCountByType);
router.get("/hotels/top-rating", HotelController.TopRatingHotel);
router.post("/hotels/search", HotelController.SearchHotelByFilter);
router.get("/hotels/:hotelId", HotelController.getHotelById);

router.get("/admin/hotels", HotelController.HotelList);
router.delete("/admin/hotels/delete/:hotelId", HotelController.deleteHotel);
router.post("/admin/hotels/add", HotelController.addHotel);
router.post("/admin/hotels/update/:hotelId", HotelController.updateHotel);

module.exports = router;
