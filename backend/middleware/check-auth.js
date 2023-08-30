const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1];                  //Authorization: 'Bearer token';  we need to split this into an array and take the second value
        if (!token) {
            throw new Error('Authentication faile!');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);    //'verify' returns the payload that was initially used to create the token
        req.userData = {userId: decodedToken.userId};                           //we can then add this data to our request object
        next();                                                                 //'next' allows the request to continue 
    } catch (err) {
        return next(new HttpError('Authentication failed!'), 401);              //if 'verify' fails, we return this error
    }
};