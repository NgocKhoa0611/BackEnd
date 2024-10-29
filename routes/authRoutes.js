const authRoutes = require('express').Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.registerUser);
authRoutes.post('/login', authController.loginUser);

module.exports = authRoutes;
