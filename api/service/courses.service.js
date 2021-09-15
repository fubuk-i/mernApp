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

exports.getAllCourses = function (doc, options) {
    return new Promise(async function (resolve, reject) {
        /* */
        var courses = [];
        try {
            var arr = [];
                var notEqual = {};
                notEqual[constants.MONGO_NOT_EQUAL] = "DELETED";

                var criteria = {};
                criteria['status'] = notEqual;//constants.ACTIVE;


                var match = { "$match": criteria }
                arr.push(match);

                var sort = { createdDate: -1 };

                var facet = {
                    $facet: {
                        courses: [
                            { $sort: sort },
                            { $skip: options.skip },
                            { $limit: options.limit }
                        ]
                    }
                }

                arr.push(facet);

                var courses = await dao.findAggregate("courses", arr);
               
                var totalRecords = await dao.getCollectionCountWithCriteria("courses", criteria);
                courses[0].totalRecords = totalRecords;
                if (courses && courses.length > 0) {
                    resolve(utils.createResponse('courses', courses, constants.SUCCESS, null, null))
                }
                else {
                    reject(utils.createErrorResponse(204, "RESOURCENOTFOUND"));
                }
        }
        catch (err) {
            console.log(err);
            reject(utils.createErrorResponse(500, "INTERNALSERVERERROR"));
        }
    });
}

exports.getCourseByCat = function (doc,options) {
    return new Promise(async function (resolve, reject) {
        /* */
        var courses = [];
        try {
            if (doc) {
                var arr = [];
                var criteria = {};
                var notEqual = {};
                notEqual[constants.MONGO_NOT_EQUAL] = "DELETED";
                criteria['status'] = notEqual;
                if (doc['category'] && doc['category'] != null && doc['category'] != "")
                {
                criteria["category"] = doc['category'];
                }
                else if (doc['subcat'] && doc['subcat'] != null && doc['subcat'] != "")
                {
                criteria["subCat"] = doc['subcat'];
                }
                var sort = { createdDate: -1 };
            
                var match = { "$match": criteria }
                arr.push(match);

                

                var facet = {
                    $facet: {
                        courses: [
                            {$sort: sort},
                            { $skip: options.skip },
                            { $limit: options.limit }
                        ]
                    }
                }

                arr.push(facet);
                var courses = await dao.findAggregate("courses", arr);

                var totalRecords = await dao.getCollectionCountWithCriteria("courses", criteria);

                courses[0].totalRecords = totalRecords;
                if (courses && courses.length > 0) {
                    resolve(utils.createResponse('courses', courses, constants.SUCCESS, null, null))
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
            winston.error(err);
            console.log("err:",err);
            reject(utils.createErrorResponse(500, errorConstants.INTERNALSERVERERROR));
        }
    });
}