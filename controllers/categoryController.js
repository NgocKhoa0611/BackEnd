const { Category } = require('../models');
const { Op } = require('sequelize');

const categoryController = {
    async getAllCategory(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách danh mục: ${error.message}` });
        }
    },
    async getCategoryByID(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục: ${error.message}` });
        }
    }

}

module.exports = categoryController;