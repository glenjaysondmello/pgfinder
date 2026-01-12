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
  port: process.env.QDRANT_PORT,
});

let embedder;
const COLLECTION = "pg_listings";
const NAMESPACE = process.env.NAMESPACE;
const DEFAULT_TENANT = process.env.DEFAULT_TENANT || "public_pg";

const initEmbedder = async () => {
  console.log("Loading embedding model");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedding model ready");
};

const embedText = async (text) => {
  const emb = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(emb[0]);
};

// const ensureCollection = async () => {
//   try {
//     await qdrant.createCollection(COLLECTION, {
//       vectors: { size: 384, distance: "Cosine" },
//     });
//     console.log("Qdrat collection created");
//   } catch (error) {
//     if (error.response?.status === 409) {
//       console.log("Collection already exists");
//     } else {
//       console.error("Error creating collection");
//       process.exit(1);
//     }
//   }
// };

const migratePGs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await initEmbedder();
    // await ensureCollection();

    const pgList = await PG.find();
    console.log(`Found ${pgList.length} PG records in MongoDB`);

    const batchSize = 64;
    for (let i = 0; i < pgList.length; i += batchSize) {
      const batch = pgList.slice(i, i + batchSize);
      const points = [];

      for (const pg of batch) {
        const text = `${pg.name}, located at ${pg.location}, priced at ₹${
          pg.price
        }, amenities: ${pg.amenities.join(", ")}`;
        const vector = await embedText(text);

        points.push({
          id: uuidv5(pg._id.toString(), NAMESPACE),
          vector: { dense: vector },
          payload: {
            tenantId: DEFAULT_TENANT,
            pgId: pg._id.toString(),
            location: pg.location,
            price: Number(pg.price),
            amenities: Array.isArray(pg.amenities) ? pg.amenities : [],
            text,
          },
        });
      }

      if (points.length > 0) {
        await qdrant.upsert(COLLECTION, { points });
        console.log(`Upserted batch ${i / batchSize + 1}`);
      }
    }

    console.log(`Migrated ${pgList.length} PGs to Qdrant`);
    await mongoose.disconnect();
    console.log("Migration complete, MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migratePGs();
