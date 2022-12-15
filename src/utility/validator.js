const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (!value) return false
    return true;
};

const isValidRequestBody = function (body) {
    return Object.keys(body).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);

}


const isValidname = function (name) {
    return /^[a-z ,.'-]+$/i.test(name);
};

const isVAlidEmail = function (email) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(email)
}

const isValidPassword = function (pass) {
    return /^.{8,15}$/.test(pass);
};

const isvalidNumber = function (value) {
    return /^([^0-9]*)$/.test(value);
}

module.exports = {
    isValid,
    isValidname,
    isValidPassword,
    isVAlidEmail,
    isValidRequestBody,
    isValidObjectId,
    isvalidNumber
}