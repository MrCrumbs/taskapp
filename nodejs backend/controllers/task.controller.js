const Task = require('../models/Task');
const cloudinary = require('cloudinary');

var imgUrl = null;
var urlImage = null;

// Image Upload
async function uploadImage(image){
    imgUrl = await cloudinary.uploader.upload(image, {folder: "task_images/"}, function(result){
        console.log(result.url);
        return result.url;
        }, function (err) {

        });
    return imgUrl;
}

// CREATE Task
exports.create_task = async (req, res) => {

    // Get Image
    var imageFile = null
    if(req.file) {
        imageFile = req.file.path;
    }
    
    // CHECK IF IMAGE EXISTS
    if(imageFile !== null) {
        await uploadImage(imageFile);
        urlImage = JSON.stringify(imgUrl.url);
    }
    else {
        urlImage = null;
    }

    let task = new Task({
        title: req.body.title,
        location: req.body.location,
        created_on: req.body.created_on,
        modified_on: req.body.modified_on,
        phone_number: req.body.phone_number,
        urgency: req.body.urgency,
        full_name: req.body.full_name,
        description: req.body.description,
        status: req.body.status,
        image: urlImage
    })

    task.save().then(result => {
        res.json({
            status: "success",
            message: "Task Created Successfully",
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

// Fetch All Tasks
exports.tasks = async (req, res) => {
    await Task.find().then(result => {
        res.json({
            status: "success",
            message: result.length + " Tasks Found",
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

// Update Task
exports.update_task = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, task) => {
        if(err) {
            res.json({
                status: "error",
                message: "Something went wrong",
                error: err
            })
        }
        else {
            if(task) {
                // Send Update Message
                sendUpdateSMS()
                res.json({
                    status: "success",
                    message: "Task Updated Successfully",
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "Task Not Found",
                })
            }
        }
    })
}

// Delete Task
exports.delete_task = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id).then(result => {
        if(result) {
            res.json({
                status: "success",
                message: "Task Deleted Successfully",
            })
        }
        else {
            res.json({
                status: "failed",
                message: "Task Not Found",
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

function sendUpdateSMS() {
    // Write your code here
}