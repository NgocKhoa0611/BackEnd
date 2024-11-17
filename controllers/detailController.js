const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');
const { Sequelize } = require('sequelize');

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
    async getProductbyCategory(req, res) {
        const categoryID = req.params.categoryID;
        try {
            const products = await Product.findAll({
                where: { category_id: categoryID },
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

            if (products.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy sản phẩm theo danh mục: ${error.message}` });
        }
    },
    async addProduct(req, res) {
        const { product_name, price, category_id, price_promotion } = req.body;

        try {
            const newProduct = await Product.create({
                product_name,
                price,
                price_promotion: price_promotion || 0,
                category_id,
            });

            res.status(201).json({
                message: 'Thêm sản phẩm thành công',
                newProduct
            });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi thêm sản phẩm: ${error.message}` });
        }
    },
    async hideProduct(req, res) {
        const { id } = req.params;
        console.log('Product ID:', id);
        try {
            const product = await Product.findByPk(id);
            console.log(product);

            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }

            product.is_hidden = true;
            await product.save();

            res.status(200).json({ message: 'Sản phẩm đã được ẩn thành công', product });
        } catch (error) {
            console.error('Lỗi khi ẩn sản phẩm:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi ẩn sản phẩm' });
        }
    },
    async showProduct(req, res) {
        const { id } = req.params;
        console.log('Product ID:', id);
        try {
            const product = await Product.findByPk(id);
            console.log(product);

            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }

            product.is_hidden = false;
            await product.save();

            res.status(200).json({ message: 'Sản phẩm đã được hiển thị thành công', product });
        } catch (error) {
            console.error('Lỗi khi hiển thị sản phẩm:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi hiển thị sản phẩm' });
        }
    },
    async updateProduct(req, res) {
        const { id } = req.params;
        const { product_name, price, price_promotion, category_id } = req.body;

        try {
            // Fetch product by ID
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
            }

            // Update product fields
            await product.update({ product_name, price, price_promotion, category_id });

            // Respond with success
            res.status(200).json({ message: 'Cập nhật sản phẩm thành công', product });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi cập nhật sản phẩm: ${error.message}` });
        }
    }
}

module.exports = detailController;