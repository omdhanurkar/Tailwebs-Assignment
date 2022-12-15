const express = require('express')
const router = express.Router()
const { createTeachers, teacherLogin } = require('../Controllers/teacherController')
const { createStudents, getStudent, updateStudent, deleteStudent } = require('../Controllers/studentController')
const { authentication, authorisation } = require('../MiddleWares/auth')


router.get('/test-me', function (req, res) {
    res.send('My Fisrt API')
})

router.post('/register', createTeachers)
router.post('/login', teacherLogin)

router.post('/student', authentication, createStudents)
router.get('/students', authentication, authorisation, getStudent)
router.put('/updatestudent/:studentId', authentication, authorisation, updateStudent)
router.delete('/deletestudent/:studentId', authentication, authorisation, deleteStudent)


module.exports = router