const productRoutes = require('express').Router();
const productController = require('../controllers/productController');

productRoutes.get('/', productController.getAllProduct);
productRoutes.get('/new', productController.getNewProducts);
productRoutes.get('/feature', productController.getFeaturedProducts);
productRoutes.get('/promotion', productController.getDiscountedProducts);
productRoutes.get('/category/:categoryID', productController.getProductbyCategory);
productRoutes.post('/', productController.createProduct);
productRoutes.delete('/:id', productController.deleteProduct);
productRoutes.put('/:id', productController.updateProduct);
productRoutes.get('/:id', productController.getProductById);

module.exports = productRoutes;