const axios = require('axios');
const redisClient = require('../redisClient');


const getWeather = async (req, res) => {
    const { city } = req.params; // Extract city from path parameters
    const { units = "metric", days = 1 } = req.query; // Extract optional query parameters

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    try {
        // Construct a unique Redis key
        const redisKey = `weather:${city}:${units}:${days}`;

        // Check if the data is in the Redis cache
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            return res.status(200).json({ data: JSON.parse(cachedData)});
        }

        // Construct the API URL
        const apiUrl = `${process.env.WEATHER_API_URL}/${city}?unitGroup=${units}&key=${process.env.WEATHER_API_KEY}&days=${days}`;
        

        // Fetch data from the 3rd party API
        const response = await axios.get(apiUrl);

        // Store the data in Redis cache for future requests
        await redisClient.setEx(redisKey, 43200, JSON.stringify(response.data)); // Cache for 12 hours

        // Return the API response
        res.status(200).json({ data: response.data});
    } catch (error) {
        console.error('Error fetching weather data:', error.message);

        // Handle specific errors
        if (error.response) {
            if (error.response.status === 404) {
                return res.status(404).json({ message: 'City not found' });
            }
            return res.status(error.response.status).json({ message: error.response.data });
        }

        res.status(500).json({ message: 'Error fetching weather data' });
    }
};

module.exports = {
    getWeather
};