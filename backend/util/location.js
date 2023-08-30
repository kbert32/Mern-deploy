const axios = require('axios');     //axios is third party library;  we are using it to assist with sending requests to Google's API for geoCoding
const HttpError = require('../models/http-error');


const API_KEY = 'AIzaSyDPMsPSIXCtlkyhIfMXFgJIZ4xrOOri3Ns';

async function getCoordsForAddress(address) {
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`);

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location for the spcified address.', 404);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
};

module.exports = getCoordsForAddress;