const userRoutes = require('express').Router();
const userController = require('../controllers/userController');

userRoutes.get('/', userController.getAllUser);
userRoutes.get('/:id', userController.getUserbyId);

module.exports = userRoutes;