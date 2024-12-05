const { Cart, CartDetail, ProductDetail, Product, ProductImage, Color, Size } = require('../models');

const cartController = {

    // Lấy giỏ hàng
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
                            { model: ProductImage, as: 'productImage' },
                            { model: Color, as: 'color' },
                            { model: Size, as: 'size' }
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

    // Thêm giỏ hàng
    async addToCart(req, res) {
        try {
            const { product_detail_id, quantity } = req.body.newItem;
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
                await CartDetail.create({
                    cart_id: cart.cart_id,
                    product_id: productDetail.product_id,
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

    // Tăng số lượng
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
                            { model: ProductImage, as: 'productImage' },
                            { model: Color, as: 'color' },
                            { model: Size, as: 'size' }
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

    // Giảm số lượng
    async decreaseQuantity(req, res) {
        try {
            const { product_detail_id } = req.body;
            const { id } = req.user;

            if (!id || !product_detail_id) {
                return res.status(400).json({ message: "User ID and Product detail ID are required" });
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

    // Xóa sản phẩm khỏi giỏ hàng
    async removeProduct(req, res) {
        try {
            const { id } = req.user;
            const { product_detail_id } = req.params;
            console.log(id);

            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            if (!product_detail_id) {
                return res.status(400).json({ message: "Product detail ID is required" });
            }

            const cartDetail = await CartDetail.findOne({
                where: { product_detail_id },
                include: [{
                    model: Cart,
                    as: "cart",
                    where: { user_id: id },
                }],
            });

            if (!cartDetail) {
                return res.status(404).json({ message: "Product not found in the cart" });
            }

            await cartDetail.destroy();

            return res.status(200).json({ message: "Product removed successfully" });
        } catch (error) {
            console.error("Error removing product:", error);  // Log the error for debugging
            res.status(500).json({ message: "Không thể xóa sản phẩm khỏi giỏ hàng." });
        }
    },

    // Tạo hàm getCartData để chỉ lấy dữ liệu giỏ hàng mà không phụ thuộc vào res
    async getCartData(userId) {
        try {
            const cartItems = await Cart.findOne({
                where: { user_id: userId },
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

            return cartItems ? cartItems : null;
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw new Error("Error fetching cart");
        }
    },

    // Lấy số lượng item trong giỏ hàng
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