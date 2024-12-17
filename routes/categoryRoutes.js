const categoryRoutes = require('express').Router();
const categoryController = require('../controllers/categoryController');

categoryRoutes.get('/', categoryController.getAllCategory);
categoryRoutes.get('/:id', categoryController.getCategoryByID);
categoryRoutes.get('/count', categoryController.countCategories);
categoryRoutes.post('/add', categoryController.addCategory);
categoryRoutes.patch('/hide/:id', categoryController.hideCategory);
categoryRoutes.patch('/show/:id', categoryController.showCategory);
categoryRoutes.put('/update/:id', categoryController.updateCategory);


module.exports = categoryRoutes;