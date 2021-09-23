const express = require('express')
const router = express.Router()
const constants = require('../../app-constants').APP_CONSTANTS;
const service = require('../../service/courses.service');

router.post('/addCourse', async (req, res, next) => {
    try {
        var doc = req.body;
        var response = await service.addCourse(doc);
        res.json(response);
    }
    catch (err) {
        if (err.error)
            res.status(err.error.code).send(err);
        else
            res.status(500).send(err);
    }

})


router.get('/getAllCourses', async (req, res, next) => {
    var doc = req.query;
    var page = doc.page ? doc.page : 1;
    try {
        var options = { skip: '', limit: '' };
        if (page && page != 'null' && page != '') {
            var recordsPerPage = 100;
            if (doc.recordsPerPage && doc.recordsPerPage != 'null' && doc.recordsPerPage != '')
                {
                recordsPerPage = parseInt(doc.recordsPerPage);
        }
            options.skip = page ? page * recordsPerPage - recordsPerPage : 0;
            options.limit = recordsPerPage;
        }
        var response = await service.getAllCourses(doc, options);
        res.json(response);
    }
    catch (err) {
        console.log("err in con",err)
        res.status(err.error.code).send(err);
    }
})

router.get('/getCourseByCat', async (req, res, next) => {
    var doc = req.query;
    var page = doc.page ? doc.page : 1;
    try {
        var options = { skip: '', limit: '' };
        if (page && page != 'null' && page != '') {
            var recordsPerPage = 100;
            if (doc.recordsPerPage && doc.recordsPerPage != 'null' && doc.recordsPerPage != '')
                {
                recordsPerPage = parseInt(doc.recordsPerPage);
        }
            options.skip = page ? page * recordsPerPage - recordsPerPage : 0;
            options.limit = recordsPerPage;
        }
        var response = await service.getCourseByCat(doc, options);
        res.json(response);
    }
    catch (err) {
        console.log("err in con",err)
        res.status(err.error.code).send(err);
    }
})

module.exports = router