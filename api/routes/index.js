const routes = require('express').Router();
const test = require('../controllers/test');
const courses = require('../controllers/courses');
const categories = require('../controllers/categories');

routes.use('/api/importData', test);
routes.use('/api/courses', courses);
routes.use('/api/categories', categories);

module.exports = routes;