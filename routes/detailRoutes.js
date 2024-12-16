const detailRoutes = require('express').Router();
const detailController = require('../controllers/detailController');
const upload = require('../middleware/upload');

detailRoutes.get('/size', detailController.getSize);
detailRoutes.get('/color', detailController.getColor);
detailRoutes.post('/productdetaillist/add-detail/:id', upload.single('product_image'), detailController.createProductDetail);

module.exports = detailRoutes;
