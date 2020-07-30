const Manager = require('../models/Manager');

// Update Manager password
exports.update_manager = async (req, res) => {
    await Manager.findByIdAndUpdate(req.params.id, {$set:  { password: req.body.password }}, {new: true}, (err, manager) => {
        if(err) {
            res.json({
                status: "error",
                message: "Something went wrong",
                error: err
            })
        }
        else {
            if(manager) {
                res.json({
                    status: "success",
                    message: "Manager updated successfully",
                    data: manager
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "Manager Not Found",
                })
            }
        }
    })
}

// Get manager with given password
exports.manager = async (req, res) => {
    await Manager.findOne({ password: req.body.password }).then(result => {
        if (result) {
            res.json({
                status: "success",
                message: "Manager with given password found",
                data: result
            })
        } else {
            res.json({
                status: "failed",
                message: "Manager Not Found",
            })
        }
    }).catch(err => {
        res.json({
            status: "error",
            message: "Something went wrong",
            error: err
        })
    });
}

// Update Manager email and number
exports.add_email_and_number = (req, res) => {
    let payload = {}
    if (req.body.email) {
        payload = {
            email_addresses_for_notifications: req.body.email
        }
    }else {
        payload = {
            phone_numbers_for_notifications: req.body.phoneNum
        }
    }
     Manager.findByIdAndUpdate( req.params.id ,  { $push:  payload  }, {new: true}, (err, manager) => {
        if(err) {
            res.json({
                status: "error",
                message: "Something went wrong",
                error: err
            })
        }
        else {
            if(manager) {
                res.json({
                    status: "success",
                    message: "Manager updated successfully",
                    data: manager
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "Manager Not Found",
                })
            }
        }
    })
}
