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
const { uploadImage } = require("../cloudinary/cloudinaryConfig");

const router = express.Router();

router.get("/getAllPg", getAllPgs);

router.get("/getPg/:id", getPg);

router.post(
  "/addPg",
  uploadImage.array("images", 5),
  addPg
);

router.patch(
  "/updatePg/:id",
  uploadImage.array("newImages", 5),
  updatePg
);

router.delete("/deletePg/:id", deletePg);

router.get("/searchPgs", searchPgs);

module.exports = router;
