const Location = require('../models/Location');

// CREATE Location
exports.create_location = async (req, res) => {
    let location = new Location({
        name: req.body.name,
        created_on: req.body.created_on
    })

    location.save().then(result => {
        res.json({
            status: "success",
            message: "Location Created Successfully",
            data: result
        })
    }).catch(err => {
        res.json({
            status: "error",
            message: "Something went wrong",
            error: err
        })
    });
}

// Fetch All Locations
exports.locations = async (req, res) => {
    await Location.find().then(result => {
        res.json({
            status: "success",
            message: result.length + " Locations Found",
            data: result
        })
    }).catch(err => {
        res.json({
            status: "error",
            message: "Something went wrong",
            error: err
        })
    });
}

// Update Location
exports.update_location = async (req, res) => {
    await Location.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, location) => {
        if(err) {
            res.json({
                status: "error",
                message: "Something went wrong",
                error: err
            })
        }
        else {
            if(location) {
                res.json({
                    status: "success",
                    message: "Location Updated Successfully",
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "Location Not Found",
                })
            }
        }
    })
}

// Delete Location
exports.delete_location = async (req, res) => {
    await Location.findByIdAndDelete(req.params.id).then(result => {
        if(result) {
            res.json({
                status: "success",
                message: "Location Deleted Successfully",
            })
        }
        else {
            res.json({
                status: "failed",
                message: "Location Not Found",
            })
        }
        
    }).catch(err => {
        res.json({
            status: "error",
            message: "Something went wrong",
            error: err
        })
    })
}