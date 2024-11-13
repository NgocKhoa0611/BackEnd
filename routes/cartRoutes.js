const cartRoutes = require('express').Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/index');

cartRoutes.get('/', authenticateToken, cartController.getCart);
cartRoutes.post('/add', authenticateToken, cartController.addToCart);


module.exports = cartRoutes;