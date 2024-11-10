const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');
const { Sequelize } = require('sequelize');

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
                            {
                                model: ProductImage, as: "productImage", // Dùng đúng alias
                            },
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
                            { model: ProductImage, as: 'productImage' }
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
    async getFeaturedProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: ProductDetail, as: 'detail',
                        include: [
                            { model: Size, as: 'size' },
                            { model: Color, as: 'color' },
                            { model: ProductImage, as: 'productImage' }
                        ],
                        where: {
                            isFeatured: 1
                        }
                    }
                ],

            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách sản phẩm nổi bật: ${error.message}` });
        }
    },
    async getNewProducts(req, res) {
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
                ],
                order: [['product_id', 'DESC']],
                limit: 6
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách sản phẩm mới: ${error.message}` }); // Update error message
        }
    },
    async getDiscountedProducts(req, res) {
        try {
            const products = await Product.findAll({
                where: {
                    price_promotion: { [Sequelize.Op.ne]: 0 }
                },
                include: [
                    {
                        model: ProductDetail, as: 'detail',
                        include: [
                            { model: Size, as: 'size' },
                            { model: Color, as: 'color' },
                            { model: ProductImage, as: 'productImage' }
                        ],
                    }
                ],
            });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách sản phẩm giảm giá: ${error.message}` });
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
    async createProduct(req, res) {
        const { product_name, price, category_id, detail } = req.body;

        try {
            const product = await Product.create({
                product_name,
                price,
                category_id,
                detail: {
                    color_id: detail.color_id,
                    size_id: detail.size_id,
                    description: detail.description,
                    productImage: {
                        img_url: detail.productImage.img_url,
                        is_primary: detail.productImage.is_primary
                    }
                }
            }, {
                include: [
                    {
                        model: ProductDetail, as: 'detail',
                        include: [{ model: ProductImage, as: 'productImage' }]
                    }
                ]
            });

            res.status(201).json({
                message: 'Thêm sản phẩm thành công',
                product
            });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi thêm sản phẩm: ${error.message}` });
        }
    },
    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            await ProductDetail.destroy({
                where: { product_id: id }
            });

            const result = await Product.destroy({
                where: { product_id: id }
            });

            if (result === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
            }

            res.status(200).json({ message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi xóa sản phẩm: ${error.message}` });
        }
    },
    async updateProduct(req, res) {
        const { id } = req.params;
        const { product_name, price, category_id, detail } = req.body;

        try {
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
            }

            await product.update({ product_name, price, category_id });

            if (detail) {
                const productDetail = await ProductDetail.findOne({
                    where: { product_id: product.product_id }
                });

                if (productDetail) {
                    await productDetail.update({
                        color_id: detail.color_id,
                        size_id: detail.size_id,
                        description: detail.description
                    });

                    if (detail.productImage) {
                        const productImage = await ProductImage.findOne({
                            where: { product_detail_id: productDetail.product_detail_id }
                        });

                        if (productImage) {
                            await productImage.update({
                                img_url: detail.productImage.img_url,
                                is_primary: detail.productImage.is_primary
                            });
                        }
                    }
                }
            }

            res.status(200).json({ message: 'Cập nhật sản phẩm thành công', product });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi cập nhật sản phẩm: ${error.message}` });
        }
    }
}

module.exports = productController;