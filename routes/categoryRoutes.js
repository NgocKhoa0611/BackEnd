const categoryRoutes = require('express').Router();
const categoryController = require('../controllers/categoryController');

categoryRoutes.get('/', categoryController.getAllCategory); // Lấy toàn bộ danh mục
categoryRoutes.get('/:id', categoryController.getCategoryByID);

module.exports = categoryRoutes;