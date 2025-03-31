const { createClient } = require('redis');
let redisClient
(async () => {
    try {
        redisClient = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                connect_timeout: 20000
            }
        });
        redisClient.on("error", async (error) => {
            console.error(" redis error "+ error)
            await redisClient.quit()
            redisClient = null
        })
        
        if(redisClient) {
            await redisClient.connect()
            console.log("Connected to Redis")
        }
        
    } catch(err) {
        console.log("Redis connection Error "+ err)
        redisClient = null
    }
    
})();

module.exports = { redisClient }