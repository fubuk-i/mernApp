const dao = require('../daos/index')
const constants = require('../app-constants').APP_CONSTANTS;
const utils = require('./utils');
const ObjectID = require('mongodb').ObjectID;

exports.addCourse = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc) {
                var document = {};
                document['catName'] = doc.catName;
                document['catIcon'] = doc.catIcon;
                document[constants.STATUS] = constants.ACTIVE;
                document['subcategories'] = [];
                if (doc.subcategories) {
                    doc.subcategories.forEach(subcat => {
                        if (!subcat._id) {
                            subcat['_id'] = new ObjectID;
                        }
                        if (!subcat.status) {
                            subcat[constants.STATUS] = 'ACTIVE';
                        }
                        document.subcategories.push(subcat);
                    })
                }
                var res = await dao.insert(document, 'categories')
                if (res && res.ops) {
                    resolve(utils.createResponse('category', res.ops[0], constants.SUCCESS, constants.SUCCESSCODE, null));

                }
                else {
                    reject(utils.createErrorResponse(500, "INTERNALSERVERERROR"));
                    return;
                }
            }
            else {
                reject(utils.createErrorResponse(400, "INVALIDPAYLOAD"));
            }
        }
        catch (ex) {
            reject(utils.createErrorResponse(500, "INTERNALSERVERERROR"));
        }

    })
}