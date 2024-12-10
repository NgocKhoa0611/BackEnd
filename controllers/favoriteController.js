const { Favorite, Product, User } = require('../models'); // Adjust the import path as needed

const favoriteController = {
    // Thêm sản phẩm yêu thích
    async addFavorite(req, res) {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc' });
        }

        try {
            // Kiểm tra sản phẩm đã tồn tại trong danh sách yêu thích chưa
            const existingFavorite = await Favorite.findOne({
                where: { user_id, product_id },
            });

            if (existingFavorite) {
                return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
            }

            const newFavorite = await Favorite.create({ user_id, product_id });
            res.status(201).json({ message: 'Thêm sản phẩm yêu thích thành công', favorite: newFavorite });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi thêm sản phẩm yêu thích: ${error.message}` });
        }
    },

    // Lấy danh sách sản phẩm yêu thích
    async getFavorites(req, res) {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'Cần cung cấp user_id để lấy danh sách yêu thích' });
        }

        try {
            const favorites = await Favorite.findAll({
                where: { user_id },
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['product_id', 'product_name', 'price', 'original_price', 'image_url'],
                    },
                ],
            });

            res.status(200).json(favorites);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách yêu thích: ${error.message}` });
        }
    },

    // Xóa sản phẩm khỏi danh sách yêu thích
    async removeFavorite(req, res) {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc' });
        }

        try {
            const favorite = await Favorite.findOne({
                where: { user_id, product_id },
            });

            if (!favorite) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh sách yêu thích' });
            }

            await favorite.destroy();
            res.status(200).json({ message: 'Xóa sản phẩm yêu thích thành công' });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi xóa sản phẩm yêu thích: ${error.message}` });
        }
    },

    // Xóa tất cả sản phẩm yêu thích của một người dùng
    async clearFavorites(req, res) {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: 'Cần cung cấp user_id để xóa tất cả yêu thích' });
        }

        try {
            await Favorite.destroy({
                where: { user_id },
            });

            res.status(200).json({ message: 'Xóa tất cả sản phẩm yêu thích thành công' });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi xóa tất cả sản phẩm yêu thích: ${error.message}` });
        }
    },
};

module.exports = favoriteController;
