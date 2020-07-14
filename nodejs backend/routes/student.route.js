module.exports = (app) => {
    const student_controller = require('../controllers/student.controller');
    const upload = require('../config/task_image.config.js');

    // Create Student
    app.post('/api/create_student', student_controller.create_student);

    // IMPORT STUDENTS
    app.post('/api/import', upload.single('file'), student_controller.import_students);

    // Fetch All students
    app.get('/api/students', student_controller.students);

    // Update students
    app.put('/api/update_student/:id', student_controller.update_student);

    // students Details
    // app.get('/api/student/:id', student_controller.student);

    // Delete students
    app.delete('/api/delete_student/:id', student_controller.delete_student);
}