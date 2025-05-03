const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


const weatherRoute = require('./Routes/weather.routes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3010;

app.use('/api/weather', weatherRoute);

app.listen(PORT, () => {
    console.log("App is running");
});
