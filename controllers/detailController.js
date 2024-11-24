const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');

const detailController = {
    async getSize(req, res) {
        try {
            const sizes = await Size.findAll();
            res.status(200).json(sizes);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách kích cỡ: ${error.message}` });
        }
    },
    async getColor(req, res) {
        try {
            const colors = await Color.findAll();
            res.status(200).json(colors);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách màu: ${error.message}` });
        }
    },
}

module.exports = detailController;