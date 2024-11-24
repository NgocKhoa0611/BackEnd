const cartRoutes = require('express').Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/index');

cartRoutes.get('/', authenticateToken, cartController.getCart);
cartRoutes.get('/count', authenticateToken, cartController.getCartCount);
cartRoutes.post('/add', authenticateToken, cartController.addToCart);
cartRoutes.put('/increase', authenticateToken, cartController.increaseQuantity);
cartRoutes.put('/decrease', authenticateToken, cartController.decreaseQuantity);
cartRoutes.delete('/:product_detail_id', authenticateToken, cartController.removeProduct);


module.exports = cartRoutes;