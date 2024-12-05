const orderRoutes = require('express').Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/index');

orderRoutes.post('/', authenticateToken, orderController.createOrder);
orderRoutes.get('/', orderController.getAllOrders);
orderRoutes.get('/:id', orderController.getOrderById);
orderRoutes.put('/:id/confirm', orderController.confirmOrder);
orderRoutes.put('/:id/cancel', orderController.cancelOrder);
orderRoutes.put('/:id/status', orderController.updateStatus);

module.exports = orderRoutes;