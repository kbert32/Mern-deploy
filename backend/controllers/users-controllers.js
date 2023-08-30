// const uuid = require('uuid');   //there are different versions for uuid, using version 4
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');


async function getUsers(req, res, next) {
    
    let users;
    try {
        users =  await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }

    if (users.length === 0) {
        return (new HttpError('Could not find any users.', 404));
    }

    res.json({users: users.map(user => user.toObject({getters: true}))});
};

async function createUser(req, res, next) {
    
    const errors = validationResult(req);    //comes from express-validator library;  'errors' object contains useful properties not used here
    if (!errors.isEmpty()) {
        
        return next (new HttpError('Invalid inputs, please check your data.', 422));    //code 422 typically used for invalid user input
    }

    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError('Could not create user.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User already exists.  Please login instead.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('Could not create user.  Please try again.'), 500);
    }

    const newUser = new User({
        name: name,
        email: email,
        image: req.file.path,       //contains the path to the image file on our server
        password: hashedPassword,
        places: []
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed.  Please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            {userId: newUser.id, email: newUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        );
    } catch (err) {
        return next(new HttpError('Signing up failed.  Please try again.'), 500);
    }

    res.status(201).json({userId: newUser.id, email: newUser.email, token: token});     //getters converts the object id to a string changing the property name from '_id' to 'id'
};

async function userLogin(req, res, next) {

    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError('Login failed.  Please try again later.', 500));
    }

    if (!existingUser) {
        return next(new HttpError('Invalid credentials.  Could not log in.', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('Could not log you in.  Please check your credentials and try again.'), 500);
    }                                   //this error returns if there is an error during the comparison, not necessarily because of invalid credentials

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials.  Could not log you in.'), 403);
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        );
    } catch (err) {
        return next(new HttpError('Logging in failed.  Please try again.'), 500);
    }

    res.status(200).json({userId: existingUser.id, email: existingUser.email, token: token});
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.userLogin = userLogin;


//error codes:

    //401   -   unauthorized;  you may be authenticated, but not allowed
    //403   -   forbidden in general; not authenticated; no valid token