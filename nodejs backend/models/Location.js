const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

let menuSchema = new Schema({
    name: {type: String, required: true},
    created_on: {type: String, required: true},
    
})
module.exports = mongoose.model('locations', menuSchema);