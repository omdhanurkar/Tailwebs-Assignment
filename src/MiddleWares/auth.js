const jwt = require('jsonwebtoken')
const teacherModel = require('../Models/teacherModel')


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]

        if (!token) {
            return res.status(401).send({ status: false, message: 'please provide token' })
        }

        let bearerToken = token.split(' ')[1]

        jwt.verify(bearerToken, 'Tailwebs', function (error, decoded) {
            if (error) {
                return res.status(401).send({ status: false, message: 'please provide valid token' })
            }

            req.decodedToken = decoded
            next()
        })

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}
//=================================================================================================================================================
const authorisation = async function (req, res, next) {
    try {
        let teacherId = req.decodedToken.teacherId

        let teacher = await teacherModel.findById({ _id: teacherId })
        if (!teacher) {
            return res.status(404).send({ status: false, message: 'teacher id does not exist' })
        }
        if (teacherId != teacher._id) {
            return res.status(403).send({ status: false, message: 'not authorised' })
        }
        next()

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

module.exports = { authentication, authorisation }
