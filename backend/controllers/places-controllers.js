const fs = require('fs');

const uuid = require('uuid');                                    //there are different versions for uuid, using version 4
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

async function getPlaceById(req, res, next) {

    const placeId = req.params.pid;     

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong. Could not find a place.', 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find a place for the provided id.', 404);
        return next(error); 
    }

    res.json({place: place.toObject( {getters: true})});    //'toObject' converts our place to a normal javascript object       
};                                                          //'getters' converts our ID object to a string

async function getPlacesByUserId(req, res, next) {

    const creatorId = req.params.uid;     

    let places;
    try {
        places = await Place.find({creator: creatorId});
    } catch (err) {
        const error = new HttpError('Sorry.  Something went wrong.  Could not find places.', 500);
        return next(error);
    }

    if (places.length === 0 || !places) {
        return next(new HttpError('Could not find any places for the provided user id', 404));
    }

    res.json({places: places.map(place => place.toObject({getters: true}))});       
};

async function createPlace(req, res, next) {
    
    const errors = validationResult(req);    //comes from express-validator library;  'errors' object contains useful properties not used here
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check your data.', 422));    //next must be used; throw does not work properly with async functions
    }
    
    const {title, description, address} = req.body;

    let coordinates;
    try {                                                       //to handle possible errors thrown from 'geCoordsForAddress' function, we need to use 'try'
        coordinates =  await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title: title,
        description: description,
        address: address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        return next(new HttpError('Creating place failed Please try again.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id', 404));
    }

    try {
        const sess = await mongoose.startSession(); //transactions allow us to perform multiple operations in isolation of each other 
        sess.startTransaction();                    //and to undo all changes if one operation fails, they are built upon sessions
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);     //'push' is not the standard array method, here it is a mongoose method that establishes the connection between our two models,
        await user.save({session: sess});   //behind the scenes, mongo grabs the created place id and adds it to the place field of the user
        await sess.commitTransaction();     //With sessions/transactions, the collection must already exist within the database, otherwise it must be manually created
    } catch (err) {
        const error = new HttpError('Creating new place failed.  Please try again.', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};




async function updatePlace(req, res, next) {

    const errors = validationResult(req);    //comes from express-validator library;  'errors' object contains useful properties not used here
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs, please check your data.', 422);
        return next(error);
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;

    // let place;
    // try {
    //     place = await Place.findByIdAndUpdate(placeId, {title: title, description: description}, {returnDocument: 'after'});    //using 'findByIdAndUpdate' would be easier if we did not need to check authorization
    // } catch (err) {                                                                                                             //'returnDocument: after' option is needed so updated place can be returned in the response
    //     return next(new HttpError('Something went wrong.  Could not update place.', 500));
    // }

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong.  Could not update place.', 500);
        return next(error);
    }

    if (place.creator.toString() !== req.userData.userId) {                             //we are comparing the creator id found on the database to the user id found in the token
        return next(new HttpError ('You are not allowed to edit this place.', 401));    //401 is an authorization error
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch(err) {
        const error = new HttpError('Something went wrong.  Could not update place.', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getter: true})});
};




async function deletePlace(req, res, next) {

    const placeId = req.params.pid;

    let place;
    let user;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Something went wrong. Could not delete place.', 500));
    }
    console.log(user);

    if (!place) {
        return next(new HttpError('Could not find a place for the provided id.', 404)); 
    }
    
    if (place.creator.id !== req.userData.userId) {                                       //we are comparing the creator id found on the database to the user id found in the token
        return next(new HttpError ('You are not allowed to delete this place.', 401));    //401 is an authorization error
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch(err) {
        console.log(err);
        return next(new HttpError('Something went wrong with session.  Could not delete place.', 500));
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({message: 'Place deleted', place: place.toObject({getter: true})});
};




exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

//installed:
    //npm install --save uuid
        //-creates unique id's, (for createPlace function)


//error codes:

    //401   -   unauthorized;  you may be authenticated, but not allowed
    //403   -   forbidden in general; not authenticated