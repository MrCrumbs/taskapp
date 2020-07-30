const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', true);

let managerSchema = new Schema({
    password: {type: String, required: true},
    phone_numbers_for_notifications: {type: Array, required: false},
    email_addresses_for_notifications: {type: Array, required: false}

})
module.exports = mongoose.model('managers', managerSchema);
