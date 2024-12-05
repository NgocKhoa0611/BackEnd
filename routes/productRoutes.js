const productRoutes = require('express').Router();
const productController = require('../controllers/productController');

productRoutes.get('/', productController.getAllProduct);
productRoutes.get('/new', productController.getNewProducts);
productRoutes.get('/feature', productController.getFeaturedProducts);
productRoutes.get('/promotion', productController.getDiscountedProducts);
productRoutes.get('/category/:categoryID', productController.getProductbyCategory);
productRoutes.get('/parent/:parentId', productController.getProductByParentID);
productRoutes.post('/', productController.addProduct);
productRoutes.patch('/hide/:id', productController.hideProduct);
productRoutes.patch('/show/:id', productController.showProduct);
productRoutes.put('/update/:id', productController.updateProduct);
productRoutes.get('/:id', productController.getProductById);

module.exports = productRoutes;