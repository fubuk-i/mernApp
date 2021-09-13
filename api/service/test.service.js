const dao = require('../daos/index');

const utils = require('./utils');

//logic to add bulk data to datbase without repeating productId
exports.addTestData = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc) {
                    await dao.insert(doc, "test");
                    var testData = await dao.checkIfExists(doc, "test")
                    resolve(utils.createResponse('testData', testData, "constants.SUCCESS", "200", null));
                }
            else {
                reject(utils.createErrorResponse(400, "errorConstants.INVALIDPAYLOAD"));
                return;
            }
        }
        catch (ex) {
            reject(utils.createErrorResponse(500, "errorConstants.INTERNALSERVERERROR"));
        }

    });
}