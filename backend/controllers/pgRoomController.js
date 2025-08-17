const { cloudinary } = require("../cloudinary/cloudinaryConfig");
const PgRoom = require("../models/PgRoom");
const redisClient = require("../redis/redisClient");

const CACHE_TTL = 3600;

const getAllPgs = async (req, res) => {
  try {
    const cacheKey = "pgs:all";

    const cachedData = await redisClient.get(cacheKey);

    if(cachedData) {
      console.log("Serving PGs from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const rooms = await PgRoom.find();

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(rooms));

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching rooms" });
  }
};

const getPg = async (req, res) => {
  try {
    const {id} = req.params;
    const cacheKey = `pg:${id}`;

    const cachedRoom = await redisClient.get(cacheKey);

    if(cachedRoom) {
      console.log("Serving PG from Redis cache");
      return res.json(JSON.parse(cachedRoom));
    }

    const room = await PgRoom.findById(id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(room));

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

    await redisClient.del("pgs:all");

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
        imagesToDelete.map((imageUrl) => {
          const publicId = imageUrl.split("/upload/")[1].split(".")[0];
          cloudinary.uploader.destroy(`pg_images/${publicId}`);
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

    await redisClient.del("pgs:all");
    await redisClient.del(`pg:${req.params.id}`);

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

    const publicIds = room.images.map((imageUrl) => {
      return imageUrl.split("/upload/")[1].split(".")[0];
    });

    await Promise.all(
      publicIds.map((publicId) => {
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await PgRoom.findByIdAndDelete(req.params.id);

    await redisClient.del("pgs:all");
    await redisClient.del(`pg:${req.params.id}`);

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

    const cacheKey = `pgs:search:${query}`;

    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      console.log("Serving search results from Redis cache");
      return res.json(JSON.parse(cachedResults));
    }

    const keywords = query.split(" ").map((word) => new RegExp(word, "i"));

    const searchResults = await PgRoom.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { amenities: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    });

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(searchResults));

    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching" });
  }
};

module.exports = { getAllPgs, getPg, addPg, updatePg, deletePg, searchPgs };
