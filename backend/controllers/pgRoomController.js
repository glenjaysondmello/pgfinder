const { cloudinary } = require("../cloudinary/cloudinaryConfig");
const PgRoom = require("../models/PgRoom");

const getAllPgs = async (req, res) => {
  try {
    const rooms = await PgRoom.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching rooms" });
  }
};

const getPg = async (req, res) => {
  try {
    const room = await PgRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching the room" });
  }
};

const addPg = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const newRoom = new PgRoom({ ...req.body, images: imageUrls });
    await newRoom.save();
    res.status(201).json({ message: "PG Room Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding the room" });
  }
};

const updatePg = async (req, res) => {
  try {
    const room = await PgRoom.findById(req.params.id);

    if (!room) return res.status(404).json({ error: "Room not found" });

    let updatedImages = room.images;
    const imagesToDelete = req.body.imagesToDelete
      ? Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : [req.body.imagesToDelete]
      : [];
    const newImages = req.files ? req.files.map((file) => file.path) : [];

    if (imagesToDelete && imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
          // const publicId = imageUrl.split("/").pop().split(".")[0];
          const publicId = imageUrl.split("/upload/")[1].split(".")[0];
          await cloudinary.uploader.destroy(`pg_images/${publicId}`);
          updatedImages = updatedImages.filter((img) => img !== imageUrl);
        })
      );
    }

    updatedImages = [...updatedImages, ...newImages];

    if (updatedImages.length > 5) {
      updatedImages = updatedImages.slice(updatedImages.length - 5);
    }

    const updatedRoom = await PgRoom.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: updatedImages },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: "Server error while updating the room" });
  }
};

const deletePg = async (req, res) => {
  try {
    const room = await PgRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    for (const imageUrl of room.images) {
      const publicId = imageUrl.split("/upload/")[1].split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await PgRoom.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting the room" });
  }
};

const searchPgs = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const keywords = query.split(" ").map((word) => new RegExp(word, "i"));

    const searchResults = await PgRoom.find({
      $or: [
        { name: { $in: keywords } },
        { location: { $in: keywords } },
        { amenities: { $in: keywords } },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching" });
  }
};

module.exports = { getAllPgs, getPg, addPg, updatePg, deletePg, searchPgs };
