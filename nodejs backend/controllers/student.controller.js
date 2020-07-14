const Student = require('../models/Student');
const excelToJson = require('convert-excel-to-json');

// CREATE Student
exports.create_student = async (req, res) => {
    let student = new Student({
        student_id: req.body.student_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        class: req.body.class
    })

    student.save().then(result => {
        res.json({
            status: "success",
            message: "Student Created Successfully",
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

// Fetch All Students
exports.students = async (req, res) => {
    await Student.find().then(result => {
        res.json({
            status: "success",
            message: result.length + " Students Found",
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

// Update Student
exports.update_student = async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, student) => {
        if(err) {
            res.json({
                status: "error",
                message: "Something went wrong",
                error: err
            })
        }
        else {
            if(student) {
                res.json({
                    status: "success",
                    message: "Student Updated Successfully",
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "Student Not Found",
                })
            }
        }
    })
}

// Delete Student
exports.delete_student = async (req, res) => {
    await Student.findByIdAndDelete(req.params.id).then(result => {
        if(result) {
            res.json({
                status: "success",
                message: "Student Deleted Successfully",
            })
        }
        else {
            res.json({
                status: "failed",
                message: "Student Not Found",
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

// INSERT FROM EXCEL
exports.import_students = (req, res) => {
    if(req.file) {
        let existingStudents = JSON.parse(req.body.students)
        let result = excelToJson({
            sourceFile: req.file.path
        });
        let students = []
        if(result) {
            result.Sheet1.shift()
            result.Sheet1.forEach(element => {
                let student = {
                    student_id: element.A,
                    first_name: element.B,
                    last_name: element.C,
                    phone_number: element.D,
                    class: element.E
                }
                students.push(student)
            });
            
            let studentsToAdd = []
            students.forEach(s => {
                let found = existingStudents.find(st => st.student_id == s.student_id)
                if(!found) {
                    studentsToAdd.push(s)
                }
            })

            Student.create(studentsToAdd, function(err, stud) {
                if(err) {
                    res.json({
                        status: "error",
                        message: "Something went wrong",
                        error: err
                    })
                }
                else {
                    res.json({
                        status: "success",
                        message: "Students Created Successfully",
                    })
                }
            })

            
        }
    }
    else {
        res.send("File Not Found")
    }
    // let student = new Student({
    //     student_id: req.body.student_id,
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name,
    //     phone_number: req.body.phone_number,
    //     class: req.body.class
    // })

    // student.save().then(result => {
    //     res.json({
    //         status: "success",
    //         message: "Student Created Successfully",
    //         data: result
    //     })
    // }).catch(err => {
    //     res.json({
    //         status: "error",
    //         message: "Something went wrong",
    //         error: err
    //     })
    // });
}