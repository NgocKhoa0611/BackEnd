const detailRoutes = require('express').Router();
const detailController = require('../controllers/detailController');

detailRoutes.get('/size', detailController.getSize);
detailRoutes.get('/color', detailController.getColor);

module.exports = detailRoutes;