const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

// Thêm sản phẩm vào danh sách yêu thích
router.post('/', favoriteController.addFavorite);

// Lấy danh sách các sản phẩm yêu thích của người dùng
router.get('/', favoriteController.getFavoritesByUser);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;
