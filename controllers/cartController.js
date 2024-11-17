const { where } = require('sequelize');
const { Cart, CartDetail, ProductDetail, Product, ProductImage } = require('../models');

const cartController = {
    async getCart(req, res) {
        try {
            const { id } = req.user;

            if (!id) {
                return res.status(400).json({ message: 'user_id is required' });
            }
            const cartItems = await Cart.findOne({
                where: { user_id: id },
                include: [{
                    model: CartDetail,
                    as: 'cartDetail',
                    include: [{
                        model: ProductDetail,
                        as: 'ProductDetail',
                        include: [
                            { model: Product, as: 'product' },
                            { model: ProductImage, as: 'productImage' }
                        ]
                    }]
                }]
            });
            res.status(200).json({ cart: cartItems });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    },
    async addToCart(req, res) {
        try {
            const { product_detail_id, quantity } = req.body;
            const { id: user_id } = req.user;

            if (!product_detail_id || !quantity) {
                return res.status(400).json({ message: 'product_detail_id và quantity là bắt buộc' });
            }

            const productDetail = await ProductDetail.findOne({
                where: { product_detail_id },
                include: [{ model: Product, as: 'product' }],
            });

            if (!productDetail) {
                return res.status(404).json({ message: 'Chi tiết sản phẩm không tìm thấy' });
            }

            let cart = await Cart.findOne({ where: { user_id } });

            if (!cart) {
                cart = await Cart.create({ user_id });
            }

            const existingCartDetail = await CartDetail.findOne({
                where: {
                    cart_id: cart.cart_id,
                    product_detail_id,
                },
            });

            if (existingCartDetail) {
                existingCartDetail.quantity += quantity;
                await existingCartDetail.save();
                return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công' });
            } else {
                // Nếu sản phẩm chưa có, tạo mới chi tiết giỏ hàng
                await CartDetail.create({
                    cart_id: cart.cart_id,
                    product_id: productDetail.product_id, // Truyền product_id từ productDetail
                    product_detail_id,
                    quantity,
                });
                return res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng' });
        }
    },
    async updateCart(req, res) {
        try {
            const userId = req.user_id;
            const { cart } = req.body;
            const cartDb = await Cart.findOne({ where: { user_id: userId } });
            if (!cartDb) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            const updatedCartDetails = cart.CartDetails.map(item => ({
                cart_id: cartDb.cart_id,
                product_detail_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }));
            await CartDetail.bulkCreate(updatedCartDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating cart' });
        }
    },
    async increaseQuantity(req, res) {
        try {
            const { product_detail_id } = req.body;
            const { id } = req.user;
            if (!id || !product_detail_id) {
                return res.status(400).json({ message: "User ID and Product ID are required" });
            }

            const cart = await Cart.findOne({
                where: { user_id: id },
                include: [{
                    model: CartDetail,
                    as: "cartDetail",
                    where: { product_detail_id },
                    include: [{
                        model: ProductDetail,
                        as: "ProductDetail",
                        include: [
                            { model: Product, as: 'product' },
                            { model: ProductImage, as: 'productImage' }
                        ]
                    }]
                }],
            });

            if (!cart || cart.cartDetail.length === 0) {
                return res.status(404).json({ message: "Cart or product not found" });
            }

            const cartDetail = cart.cartDetail[0];
            cartDetail.quantity += 1;
            await cartDetail.save();
            res.status(200).json({ message: "Quantity increased", cartDetail });
        } catch (error) {
            console.error("Error increasing quantity:", error);
            res.status(500).json({ message: "Không thể tăng số lượng sản phẩm." });
        }
    },
    async decreaseQuantity(req, res) {
        try {
            const { product_detail_id } = req.body;
            const { id } = req.user;

            if (!id || !product_detail_id) {
                return res.status(400).json({ message: "User ID and Product ID are required" });
            }

            const cart = await Cart.findOne({
                where: { user_id: id },
                include: [{
                    model: CartDetail,
                    as: "cartDetail",
                    where: { product_detail_id },
                    include: [{
                        model: ProductDetail,
                        as: "ProductDetail",
                        include: [
                            { model: Product, as: 'product' },
                            { model: ProductImage, as: 'productImage' }
                        ]
                    }]
                }],
            });

            if (!cart || cart.cartDetail.length === 0) {
                return res.status(404).json({ message: "Cart or product not found" });
            }

            const cartDetail = cart.cartDetail[0];

            if (cartDetail.quantity > 1) {
                cartDetail.quantity -= 1;
                await cartDetail.save();
                return res.status(200).json({ message: "Quantity decreased", cartDetail });
            } else {
                return res.status(400).json({ message: "Quantity cannot be less than 1" });
            }

        } catch (error) {
            console.error("Error decreasing quantity:", error);
            res.status(500).json({ message: "Không thể giảm số lượng sản phẩm." });
        }
    },
    async removeProduct(req, res) {
        try {
            const { product_detail_id } = req.body;
            const { id } = req.user;

            if (!id || !product_detail_id) {
                return res.status(400).json({ message: "User ID and Product ID are required" });
            }

            const cart = await Cart.findOne({
                where: { user_id: id },
                include: [{
                    model: CartDetail,
                    as: "cartDetail",
                    where: { product_detail_id },
                }],
            });

            if (!cart || cart.cartDetail.length === 0) {
                return res.status(404).json({ message: "Cart or product not found" });
            }

            const cartDetail = cart.cartDetail[0];
            await cartDetail.destroy();

            const updatedCart = await cartController.getCart(id);

            res.status(200).json({ message: "Product removed", updatedCart });
        } catch (error) {
            console.error("Error removing product:", error);
            res.status(500).json({ message: "Không thể xóa sản phẩm khỏi giỏ hàng." });
        }
    },
    async getCartCount(req, res) {
        try {
            const { id: user_id } = req.user;
            const cart = await Cart.findOne({
                where: { user_id },
                include: [{
                    model: CartDetail,
                    as: 'cartDetail',
                }],
            });
            if (!cart) {
                return res.json({ count: 0 });
            }
            const count = cart.cartDetail.reduce((sum, item) => sum + item.quantity, 0);
            return res.json({ count });
        } catch (error) {
            console.error('Error fetching cart count:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi lấy số lượng giỏ hàng' });
        }
    }

}

module.exports = cartController;