const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, require: true},    
    email: {type: String, require: true, unique: true},  //'unique' speeds up the querying process by creating a unique index  
    password: {type: String, require: true, minlength: 6},
    image: {type: String, require: true},
    places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]     //'ref' creates a relation with the Place model;  
});                                                                             //The brackets '[]' let mongo know this property can have multiple values


userSchema.plugin(uniqueValidator);     //makes sure we can query our database as fast as possible with 'unique', and  
                                        //makes sure we can only create a new user if the email does not already exist

module.exports = mongoose.model('User', userSchema);        //Our name should be capitalized and be in singular form by convention, 
                                                            //the name of our collection will be based on the name chosen here:
                                                            //'User' becomes 'users' in Mongodb

//installed:
    //npm install --save mongoose-unique-validator
        //helps us ensure that an email is unique