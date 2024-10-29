const productRoutes = require('express').Router();
const productController = require('../controllers/productController');

productRoutes.get('/', productController.getAllProduct);
productRoutes.get('/:id', productController.getProductById);
productRoutes.get('/category/:categoryId', productController.getProductbyCategory);

module.exports = productRoutes;