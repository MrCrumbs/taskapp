module.exports = (app) => {
    const task_controller = require('../controllers/task.controller');
    const upload = require('../config/task_image.config.js');

    // Create task
    app.post('/api/create_task', upload.single('image'), task_controller.create_task);

    // Fetch All tasks
    app.get('/api/tasks', task_controller.tasks);

    // Update tasks
    app.put('/api/update_task/:id', task_controller.update_task);

    // tasks Details
    // app.get('/api/task/:id', task_controller.task);

    // Delete tasks
    app.delete('/api/delete_task/:id', task_controller.delete_task);
}