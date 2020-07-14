module.exports = (app) => {
    const location_controller = require('../controllers/location.controller');

    // Create Menu
    app.post('/api/create_location', location_controller.create_location);

    // Fetch All locations
    app.get('/api/locations', location_controller.locations);

    // // Update locations
    app.put('/api/update_location/:id', location_controller.update_location);

    // // locations Details
    // app.get('/api/location/:id', location_controller.location);

    // // Delete locations
    app.delete('/api/delete_location/:id', location_controller.delete_location);
}