const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');

const productController = {
    async getAllProduct(req, res) {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: ProductDetail, as: 'detail',
                        include: [
                            { model: Size, as: 'size' },
                            { model: Color, as: 'color' },
                            { model: ProductImage, as: 'productImage' }
                        ]
                    }
                ]
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách sản phẩm: ${error.message}` });
        }
    },
    async getProductById(req, res) {
        const productId = req.params.id; // Lấy ID từ tham số URL
        try {
            const product = await Product.findOne({
                where: { product_id: productId },
                include: [
                    {
                        model: ProductDetail, as: 'detail',
                        include: [
                            { model: Size, as: 'size' },
                            { model: Color, as: 'color' },
                            { model: ProducImage, as: 'productImage' }
                        ]
                    }
                ]
            });

            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy sản phẩm: ${error.message}` });
        }
    },
    async getProductbyCategory(req, res) {
        const categoryID = req.params.categoryID;
        try {
            const products = await Product.findAll({
                where: { category_id: categoryId },
                include: [
                    {
                        model: ProductDetail,
                        include: [
                            { model: Size, as: 'size' },
                            { model: Color, as: 'color' },
                            { model: ProducImage, as: 'productImage' }
                        ]
                    }
                ]
            });

            if (products.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy sản phẩm theo danh mục: ${error.message}` });
        }
    }
}

module.exports = productController;