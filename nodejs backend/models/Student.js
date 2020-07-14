const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

let studentSchema = new Schema({
    student_id: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    phone_number: {type: String, required: true},
    class: {type: String, required: true},
    
})
module.exports = mongoose.model('students', studentSchema);