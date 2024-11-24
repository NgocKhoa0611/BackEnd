const orderRoutes = require('express').Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/index');

orderRoutes.post('/', authenticateToken, orderController.createOrder);
orderRoutes.get('/', orderController.getAllOrders);
orderRoutes.put('/:id/confirm', orderController.confirmOrder);

module.exports = orderRoutes;