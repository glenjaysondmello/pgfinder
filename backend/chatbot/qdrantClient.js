const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline, mean_pooling, mean } = require("@xenova/transformers");

let embedder;

(async () => {
  console.log("Loading embedding model");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedding model ready");
})();

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION = "pg_listings";

(async () => {
  try {
    await qdrant.createCollection(COLLECTION, {
      vectors: { size: 384, distance: "Cosine" },
    });
    console.log("Qdrat collection created");
  } catch (error) {
    if (error.response?.status === 409) {
      console.log("Collection already exists");
    } else {
      console.error(error);
    }
  }
})();

const embedText = async(text) => {
    const emb = await embedder(text, {pooling: "mean", normalize: true});
    return emb[0];
}

