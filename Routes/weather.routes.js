const express = require('express');
const { getWeather } = require('../Controllers/weather.controller');
const rateLimiter = require('../Middlewares/rateLimiter');

const router = express.Router();

// Weather route with rate limiting
router.get('/:city', rateLimiter, getWeather);

module.exports = router;