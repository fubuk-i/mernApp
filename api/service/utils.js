
const constants = require('../app-constants').APP_CONSTANTS;
var cfg = require('../config');

//const winston = require('../config/winston');

//utiliy functions used throughout the program

exports.createResponse = function (property, value, status, code, error) {
    var response = {};
    response.status = status;
    if (code)
        response.code = code;
    if (property)
        response[property] = value;
    else
        response[constants.RESPONSE] = null;
    if (!error) {
        response.error = error;
    }
    else {
        response.error = {}
        response.error.code = code != null ? code : 0;
        response.error.message = error;
    }

    return response;
}

exports.createErrorResponse = function (code, message) {
    var err = {};
    err.status = constants.FAILED;
    err.response = null;
    err.error = {}
    err.error.code = code;
    err.error.message = message;
    return err;
}

exports.createDetailedErrorResponse = function (status, response, code, message) {
    var err = {};

    err.status = status;
    err.response = response;
    err.error = {}
    err.error.code = code;
    err.error.message = message;
    return err;
}













