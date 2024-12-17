const cityRoutes = require('express').Router();
const cityController = require('../controllers/cityController');

cityRoutes.get('/', cityController.getAllCities);

module.exports = cityRoutes;