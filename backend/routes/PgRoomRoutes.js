const express = require("express");
const {
  addRoom,
  updateRoom,
  deleteRoom,
  searchRooms,
} = require("../controllers/pgRoomController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/addRoom", verifyToken, verifyAdmin, addRoom);

router.patch("/updateRoom", verifyToken, verifyAdmin, updateRoom);

router.delete("/deleteRoom", verifyToken, verifyAdmin, deleteRoom);

router.get("/searchRooms", verifyToken, searchRooms);

module.exports = router;
