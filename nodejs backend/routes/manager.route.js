module.exports = (app) => {
    const manager_controller = require('../controllers/manager.controller');

    // Get manager after password match
    app.post('/api/get_manager_after_password_match', manager_controller.manager);
    // Update manager password
    app.put('/api/update_manager_password/:id', manager_controller.update_manager);
    // add manager email and number
    app.put('/api/add_manager_email_and_number/:id', manager_controller.add_email_and_number);
}
