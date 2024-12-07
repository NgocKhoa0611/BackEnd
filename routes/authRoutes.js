const authRoutes = require('express').Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.registerUser);
authRoutes.post('/login', authController.loginUser);
authRoutes.get('/confirm-account', authController.confirmAccount);
authRoutes.get('/protected', authController.checkToken, (req, res) => {
    res.status(200).json({
        message: "Bạn đã truy cập vào route bảo mật.",
        user: req.user, // Dữ liệu người dùng từ token
    });
});
module.exports = authRoutes;
