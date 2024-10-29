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
    async getCategory_1(req, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    category_id: {
                        [Op.like]: '1%'
                    }
                }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục có ID bắt đầu bằng "1": ${error.message}` });
        }
    },
    async getCategory_2(req, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    category_id: {
                        [Op.like]: '2%'
                    }
                }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục có ID bắt đầu bằng "2": ${error.message}` });
        }
    },
    async getCategory_3(req, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    category_id: {
                        [Op.like]: '3%'
                    }
                }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục có ID bắt đầu bằng "3": ${error.message}` });
        }
    },
    async getCategory_4(req, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    category_id: {
                        [Op.like]: '4%'
                    }
                }
            });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục có ID bắt đầu bằng "4": ${error.message}` });
        }
    },
}

module.exports = categoryController;