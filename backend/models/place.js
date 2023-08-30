const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    address: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}       //this tells mongodb to create an Id object; 
});                                                                             //'ref' refers to our User model, this creates a relation between the two

module.exports = mongoose.model('Place', placeSchema);  //Our name should be capitalized and be in singular form by convention, 
                                                        //the name of our collection will be based on the name chosen here:
                                                        //'Place' becomes 'places' in our Mongodb database
