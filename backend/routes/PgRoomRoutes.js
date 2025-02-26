const express = require("express");
const {
  getAllPgs,
  getPg,
  addPg,
  updatePg,
  deletePg,
  searchPgs,
} = require("../controllers/pgRoomController");
// const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../cloudinary/cloudinaryConfig");

const router = express.Router();

router.get("/getAllPg", getAllPgs);

router.get("/getPg/:id", getPg);

router.post("/addPg",upload.array("images", 5), addPg);

router.patch("/updatePg/:id", upload.array("newImages", 5), updatePg);

router.delete("/deletePg/:id", deletePg);

router.get("/searchPgs", searchPgs);

module.exports = router;
