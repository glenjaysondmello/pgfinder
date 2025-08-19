const { createClient } = require("redis");

const REDIS_URL =
  `redis://redis:6379`;

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// const redisClient = createClient({
//   url: "redis://127.0.0.1:6379",
// });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

module.exports = redisClient;
