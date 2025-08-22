const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@xenova/transformers");
const { v5: uuidv5 } = require("uuid");

let embedder;
const COLLECTION = "pg_listings";
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

(async () => {
  console.log("Loading embedding model");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedding model ready");
})();

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// (async () => {
//   try {
//     await qdrant.createCollection(COLLECTION, {
//       vectors: { size: 384, distance: "Cosine" },
//     });
//     console.log("Qdrat collection created");
//   } catch (error) {
//     if (error.response?.status === 409) {
//       console.log("Collection already exists");
//     } else {
//       console.error(error);
//     }
//   }
// })();

const embedText = async (text) => {
  const emb = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(emb[0]);
};

const addPGtoVectorDB = async (pg) => {
  const text = `${pg.name}, located at ${pg.location}, priced at ₹${
    pg.price
  }, amenities: ${pg.amenities.join(", ")}`;
  const vector = await embedText(text);

  await qdrant.upsert(COLLECTION, {
    points: [
      { id: uuidv5(pg._id.toString(), NAMESPACE), vector, payload: { text } },
    ],
  });
};

const deletePGVector = async (pgId) => {
  const vectorId = uuidv5(pgId.toString(), NAMESPACE);

  await qdrant.delete(COLLECTION, {
    points: [vectorId],
  });

  console.log(`Deleted PG vector with ID ${pgId} from Qdrant`);
};

const searchPGsVector = async (query, topK = 5) => {
  const vector = await embedText(query);
  const res = await qdrant.search(COLLECTION, { vector, limit: topK });
  return res.map((r) => r.payload.text);
};

module.exports = { addPGtoVectorDB, deletePGVector, searchPGsVector };
