const detailRoutes = require('express').Router();
const detailController = require('../controllers/detailController');
const upload = require('../middleware/upload')


detailRoutes.get('/size', detailController.getSize);
detailRoutes.get('/color', detailController.getColor);
detailRoutes.post('/detail', upload.single('product_image'), detailController.createProductDetail);



module.exports = detailRoutes;