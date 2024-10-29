const categoryRoutes = require('express').Router();
const categoryController = require('../controllers/categoryController');

categoryRoutes.get('/', categoryController.getAllCategory); // Lấy toàn bộ danh mục
categoryRoutes.get('/1', categoryController.getCategory_1); // Lấy danh mục thuộc áo
categoryRoutes.get('/2', categoryController.getCategory_2); // Lấy danh mục thuộc quần
categoryRoutes.get('/3', categoryController.getCategory_3); // Lấy danh mục thuộc phụ kiện
categoryRoutes.get('/4', categoryController.getCategory_4); // Lấy danh mục thuộc giày

module.exports = categoryRoutes;