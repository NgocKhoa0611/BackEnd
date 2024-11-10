const cartRoutes = require('express').Router();
const cartController = require('../controllers/cartController');

cartRoutes.get('/', cartController.getCart);
cartRoutes.post('/add', cartController.addCart);


module.exports = cartRoutes;