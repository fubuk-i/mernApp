const dao = require('../daos/index')
const constants = require('../app-constants').APP_CONSTANTS;
const utils = require('./utils');
const ObjectID = require('mongodb').ObjectID

exports.addCategory = function (doc) {
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

exports.getAllCategories = function (doc, options) {
    return new Promise(async function (resolve, reject) {
        /* */
        var categories;
        try {

            if (doc) {
                var notEqual = {};
                notEqual[constants.MONGO_NOT_EQUAL] = "DELETED";

                var criteria = {};
                criteria['status'] = notEqual;//constants.ACTIVE;

                var totalRecords = await dao.getCollectionCountWithCriteria('categories', criteria);

                categories = await dao.getCollectionWithCriteriaAndProjections('categories', criteria, {}, options);

                var res = { categories: categories, totalRecords: totalRecords };

                if (categories && categories.length > 0) {
                    resolve(utils.createResponse('result', res, constants.SUCCESS, null, null))
                }
                else {
                    reject(utils.createErrorResponse(204, "RESOURCENOTFOUND"));
                }
            }
            else {
                winston.error("Invalid Payload");
                reject(utils.createErrorResponse(400, "INVALIDPAYLOAD"));
                return;
            }
        }
        catch (err) {
            reject(utils.createErrorResponse(500, "INTERNALSERVERERROR"));
        }
    });
}