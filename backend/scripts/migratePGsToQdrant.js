const mongoose = require("mongoose");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@xenova/transformers");
const dotenv = require("dotenv");
const PG = require("../models/PgRoom");
const { v5: uuidv5 } = require("uuid");

dotenv.config();

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

let embedder;
const COLLECTION = "pg_listings";
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const initEmbedder = async () => {
  console.log("Loading embedding model");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedding model ready");
};

const embedText = async (text) => {
  const emb = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(emb[0]);
};

const ensureCollection = async () => {
  try {
    await qdrant.createCollection(COLLECTION, {
      vectors: { size: 384, distance: "Cosine" },
    });
    console.log("Qdrat collection created");
  } catch (error) {
    if (error.response?.status === 409) {
      console.log("Collection already exists");
    } else {
      console.error("Error creating collection");
      process.exit(1);
    }
  }
};

const migratePGs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await initEmbedder();
    // await ensureCollection();

    const pgList = await PG.find();
    console.log(`📦 Found ${pgList.length} PG records in MongoDB`);

    const points = [];

    for (const pg of pgList) {
      const text = `${pg.name}, located at ${pg.location}, priced at ₹${
        pg.price
      }, amenities: ${pg.amenities.join(", ")}`;

      const vector = await embedText(text);

      points.push({
        id: uuidv5(pg._id.toString(), NAMESPACE),
        vector,
        payload: { text, mongoId: pg._id.toString() },
      });
    }

    if (points.length > 0) {
      await qdrant.upsert(COLLECTION, { points });
      console.log(`Migrated ${points.length} PGs to Qdrant`);
    } else {
      console.log("No PG records found to migrate");
    }
    await mongoose.disconnect();
    console.log("Migration complete, MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migratePGs();
