const { createClient } = require("redis");
const redisClient = createClient({
  url: "redis://localhost:6379",
});
redisClient.on("error", err => {
  console.log("redis : ", err);
});

const connectRedis = async () => {
  await redisClient.connect();
  console.log("redis connected");
};

module.exports = {
  connectRedis,
  redisClient,
};
