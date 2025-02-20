const PgRoom = require("../models/PgRoom");

const addRoom = async (req, res) => {
  try {
    const newRoom = new PgRoom(req.body);
    await newRoom.save();
    res.status(201).json({ message: "PG Room Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding the room" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await PgRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: "Server error while updating the room" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await PgRoom.findById(req.params.id);

    if(!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await PgRoom.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting the room" });
  }
};

const searchRooms = async (req, res) => {
  try {
    const { query } = req.query; // Fix here

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const keywords = query.split(" ").map((word) => new RegExp(word, "i"));

    const searchResults = await PgRoom.find({
      $or: [
        { name: { $in: keywords } },
        { location: { $in: keywords } },
        { amenities: { $in: keywords } }
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching" });
  }
};


module.exports = { addRoom, updateRoom, deleteRoom, searchRooms };
