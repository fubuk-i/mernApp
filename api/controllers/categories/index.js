const express = require('express')
const router = express.Router()
const constants = require('../../app-constants').APP_CONSTANTS;
const service = require('../../service/categories.service');

router.post('/addCategory', async (req, res, next) => {
    try {
        var doc = req.body;
        var response = await service.addCategory(doc);
        res.json(response);
    }
    catch (err) {
        if (err.error)
            res.status(err.error.code).send(err);
        else
            res.status(500).send(err);
    }

})

router.get('/getAllCategories', async (req, res, next) => {

    try {
        var doc = req.query;
        var sort = { catName: 1 };
        var page = doc.page;
        var options = { sort: sort, skip: page ? +page * 10 - 10 : 0, limit: 10 };

        var response = await service.getAllCategories(doc, options);
        res.json(response);
    }
    catch (err) {
        res.status(err.error.code).send(err);
    }
})

module.exports = router