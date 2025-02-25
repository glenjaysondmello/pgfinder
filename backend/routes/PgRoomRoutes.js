const express = require("express");
const {
  getAllPgs,
  getPg,
  addPg,
  updatePg,
  deletePg,
  searchPgs,
} = require("../controllers/pgRoomController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getAllPg", verifyToken, verifyAdmin, getAllPgs);

router.get("/getPg/:id", verifyToken,  getPg);

router.post("/addPg", verifyToken, addPg);

router.patch("/updatePg/:id", verifyToken, updatePg);

router.delete("/deletePg/:id", verifyToken, deletePg);

router.get("/searchPgs", verifyToken, searchPgs);

module.exports = router;
