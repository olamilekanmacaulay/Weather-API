const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.connect().catch((err) => {
    console.error('Error connecting to Redis:', err);
});

module.exports = redisClient;