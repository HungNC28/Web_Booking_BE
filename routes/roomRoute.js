const express = require("express");
const router = express.Router();

const RoomController = require("../controllers/User/RoomController");

router.post("/rooms/room-available/:hotelId", RoomController.RoomAvailable);
router.get("/rooms/:roomId", RoomController.getRoomById);

router.get("/admin/rooms", RoomController.RoomsList);
router.delete("/admin/rooms/delete/:roomId", RoomController.deleteRoom);
router.post("/admin/rooms/add", RoomController.addRoom);
router.post("/admin/rooms/update/:roomId", RoomController.updateRoom);

module.exports = router;
