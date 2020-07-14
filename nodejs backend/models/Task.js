const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

let menuSchema = new Schema({
    title: {type: String, required: true},
    location: {type: String, required: true},
    created_on: {type: String, required: true},
    modified_on: {type: String, required: true},
    phone_number: {type: String, required: true},
    urgency: {type: String, required: true},
    full_name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true},
    image: {type: String, required: false}
    
})
module.exports = mongoose.model('tasks', menuSchema);