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
    const imageUrls = req.files.map((file) => file.path);

    const newRoom = new PgRoom({ ...req.body, images: imageUrls });
    await newRoom.save();
    res.status(201).json({ message: "PG Room Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding the room" });
  }
};

const updatePg = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    const updatedRoom = await PgRoom.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(imageUrls && { images: imageUrls }) },
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

    for(const imageUrl of room.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
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
