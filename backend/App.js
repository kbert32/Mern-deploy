const fs = require('fs');           //core node.js module that allows us to interact with files and the filesystem
const path = require('path');       //path is module built into node

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ow2ya0v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));       //static is built into express;  just returns a file, does not execute it

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});
                                            //a middleware function provided with 4 parameters, will be recognized by express as an error handling middleware
app.use((error, req, res, next) => {        //this function will only be executed on the requests that have an error attached, where an error was thrown 
    if (req.file) {                         //this function will execute if any middleware in front of it yields an error.   
        fs.unlink(req.file.path, err => {   //multer adds this 'file' object to the request and gives it the 'path' property
            console.log(err);               //'unlink' provides us with an error in a callback function if something goes wrong, here we are just 
        });                                 //console.log'ing it; we are using 'unlink' here to delete image files from the server should we encounter an error
    }                                   

    if (res.headerSent) {                   //'headerSent' checks to see if a response was already sent, if so we return next and forward the error                
        return next(error);                 
    }                                       

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'}); //we should send an error message along with any errors
});                                         

mongoose
    .connect(url)
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });


//installed:
    //npm install express --save
        //-express is a node framework
    //npm install nodemon --save-dev
        //-allows automatic re-starting of the server with file updates
        //-also added 'start': 'nodemon app.js' script to package.json
    //npm install body-parser --save
        //-assists with parsing incoming request bodies; creates a 'req.body' object
    //npm install --save uuid
        //-creates unique id's, (for createPlace function)
    //npm install --save express-validator
        //-third party validation library
    //npm install --save axios
        //-assists with sending requests to Google's geoCoding API
    //npm install --save mongoose
        //-assists with accessing Mongodb
    //npm install --save mongoose-unique-validator
        //helps us ensure that an email is unique
    //npm install --save multer
        //a node.js middleware for handling multipart/form-data; primarily used for uploading files
    //npm install --save bcryptjs
        //node.js library that helps us hash/encrypt passwords
    //npm install --save jsonwebtoken
        //this package allows us to generate tokens with private keys.  json web tokens are the most common way of implementing 
        //authentication in single page web applications