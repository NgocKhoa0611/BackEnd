const detailRoutes = require('express').Router();
const detailController = require('../controllers/detailController');

detailRoutes.get('/size', detailController.getSize);
detailRoutes.get('/color', detailController.getColor);
// detailRoutes.post('/', productController.addProduct);
// detailRoutes.patch('/hide/:id', productController.hideProduct);
// detailRoutes.patch('/show/:id', productController.showProduct);
// detailRoutes.put('/update/:id', productController.updateProduct);
// detailRoutes.get('/:id', productController.getProductById);

module.exports = detailRoutes;