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

module.exports = router