const teacherModel = require("../Models/teacherModel")
const check = require("../utility/validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

//=================================================================================================================================================

const createTeachers = async function (req, res) {
    try {
        const data = req.body
        if (!check.isValidRequestBody(data)) { return res.status(400).send({ status: false, message: "Please enter data to create user" }) }

        const { name, email, password } = data

        if (!name) { return res.status(400).send({ status: false, message: "name is mandatory" }) };
        if (!check.isValidname(name)) { return res.status(400).send({ status: false, message: "name should be in Alphabets" }) };

        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) };
        if (!check.isVAlidEmail(email)) { return res.status(400).send({ status: false, message: "Email should be valid" }) };
        let checkEmail = await teacherModel.findOne({ email });
        if (checkEmail) return res.status(400).send({ status: false, message: "This email is already registered" });

        if (!password) { return res.status(400).send({ status: false, message: "Password is mandatory" }) };
        if (!check.isValidPassword(password)) { return res.status(400).send({ status: false, message: "Password should be valid" }) };
        const encryptedPassword = await bcrypt.hash(password, 10)

        const userDetails = { name, email, password: encryptedPassword }
        await teacherModel.create(userDetails);
        return res.status(201).send({ status: true, message: "teacher created successfully", data: userDetails })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//=================================================================================================================================================

const teacherLogin = async function (req, res) {
    
    try {
        let data = req.body
        const { email, password } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data'})
        }

        if (!email) return res.status(400).send({ status: false, message: 'Email is required'})

        if (!password) return res.status(400).send({ status: false, message: 'password is required'})

        let teacher = await teacherModel.findOne({ email })
        if (!teacher) return res.status(400).send({ status: false, message: "email or password is incorrect"})

        let hashedPassword = await bcrypt.compare(password, teacher.password)
        if (!hashedPassword) return res.status(400).send({ status: false, message: "email or password is incorrect"})

        let token = jwt.sign({
            teacherId: teacher._id,
        }, 'Tailwebs',
            { expiresIn: "24hr" })

        return res.status(201).send({ status: true, message: 'token created successfully', data: { teacherId: teacher._id, token: token } })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}



module.exports = { createTeachers, teacherLogin }