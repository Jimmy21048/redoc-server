const { createClient } = require('redis');
let redisClient
(async () => {
    redisClient = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });
    redisClient.on("error", (error) => console.error("error "+ error))
    await redisClient.connect()
    console.log("Connected to Redis")
})();

module.exports = { redisClient }