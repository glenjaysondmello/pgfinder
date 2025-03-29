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
const { uploadImage } = require("../cloudinary/cloudinaryConfig");

const router = express.Router();

router.get("/getAllPg", verifyToken, verifyAdmin, getAllPgs);
router.get("/getPg/:id", verifyToken, verifyAdmin, getPg);

router.post(
  "/addPg",
  verifyToken, 
  verifyAdmin, 
  uploadImage.array("images", 5), 
  addPg
);

router.patch(
  "/updatePg/:id",
  verifyToken, 
  verifyAdmin, 
  uploadImage.array("newImages", 5), 
  updatePg
);

router.delete("/deletePg/:id", verifyToken, verifyAdmin, deletePg);

router.get("/searchPgs", verifyToken, searchPgs);

module.exports = router;
