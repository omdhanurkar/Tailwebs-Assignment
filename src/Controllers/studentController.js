const studentModel = require('../Models/studentModel')
const teacherModel = require('../Models/teacherModel')
const check = require("../utility/validator")
  
const createStudents = async function (req, res) {
    try {
        let data = req.body
        
        let { name, subject, marks ,teacherId} = data

        if (!name) { return res.status(400).send({ status: false, message: "name is mandatory" }) };
        if (!check.isValidname(name)) { return res.status(400).send({ status: false, message: "name should be in Alphabets" }) };

        if (!subject) { return res.status(400).send({ status: false, message: "subject is mandatory" }) };
        if (!check.isValidname(subject)) { return res.status(400).send({ status: false, message: "subject should be in Alphabets" }) };

        if (!marks) { return res.status(400).send({ status: false, message: "marks is mandatory" }) };
        if (check.isvalidNumber(marks)) { return res.status(400).send({ status: false, message: "marks should be in Alphabets" }) };

        let teacher = await teacherModel.findById(teacherId)
        if (!teacher) return res.status(400).send({ status: false, message: "Please enter the registerd teacherId" })

        if (req.decodedToken.teacherId != teacherId)
            return res.status(403).send({ status: false, message: "you are not authorised" })

        const findStudent = await studentModel.findOne({ name: name, subject: subject, teacherId: teacherId })
        if (findStudent) {
            const updateStudent = await studentModel.findOneAndUpdate({ name: name, subject: subject, teacherId: teacherId }, { $inc: { marks: +marks } }, { new: true })

            return res.status(200).send({ status: true, message: "successfully ", data: updateStudent })
        }
        
        const newStudent = await studentModel.create(data);
        return res.status(201).send({ status: true, message: "student created successfully", data: newStudent })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}


const getStudent = async function (req, res) {

    try {
        let data = req.query
        let teacherId = req.decodedToken.teacherId
        let { name, subject } = data
        let queryFilter = { teacherId: teacherId, isDeleted: false }

        if (name) queryFilter.name = name
        if (subject) queryFilter.subject = subject

        let findStudent = await studentModel.find(queryFilter)
        if (findStudent.length === 0) return res.status(400).send({ status: false, message: 'no student found' })

        return res.status(200).send({ status: true, message: "students fetched successfully", data: findStudent })

    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })

    }
}



const updateStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        let teacherId = req.decodedToken.teacherId
        let data = req.body

        if (!check.isValidObjectId(studentId)) { return res.status(400).send({ status: false, message: "studetId should be valid" }) };

        let studentExist = await studentModel.findById(studentId)
        console.log(studentExist.teacherId.toString())

        if (!studentExist) {
            return res.status(404).send({ status: false, message: "student not found" })
        }

        if (studentExist.teacherId != teacherId) {
            return res.status(404).send({ status: false, message: "teacher not authorized" })
        }

        let upadateData = await studentModel.findByIdAndUpdate(
            { _id: studentId, isDeleted: false },
            data,
            { new: true }
        )
        return res.status(200).send({ status: true, message: "Success", data: upadateData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const deleteStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId;
        let teacherId = req.decodedToken.teacherId

        const student = await studentModel.findOne({ _id: studentId }, { isDeleted: false })
        if (!student)
            return res.status(400).send({ status: false, message: "student deleted alresdy" })

        if (student.teacherId != teacherId) {
            return res.status(404).send({ status: false, message: "teacher not authorized" })
        }

        await studentModel.findOneAndUpdate({ _id: studentId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Success" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createStudents, getStudent, updateStudent, deleteStudent }