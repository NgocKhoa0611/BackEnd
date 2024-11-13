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
            const { product_id, quantity } = req.body;
            const { id: user_id } = req.user;

            if (!product_id || !quantity) {
                return res.status(400).json({ message: 'product_id và quantity là bắt buộc' });
            }

            // Tìm thông tin chi tiết sản phẩm (ProductDetail)
            const productDetail = await ProductDetail.findOne({
                where: { product_id },
                include: [{ model: Product, as: 'product' }],
            });

            // Nếu không tìm thấy chi tiết sản phẩm
            if (!productDetail) {
                return res.status(404).json({ message: 'Chi tiết sản phẩm không tìm thấy' });
            }

            // Tìm giỏ hàng của người dùng
            const cart = await Cart.findOne({
                where: { user_id },
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

            // Nếu giỏ hàng đã tồn tại
            if (cart) {
                // Kiểm tra sản phẩm trong giỏ hàng đã có chưa
                const existingCartDetail = cart.cartDetail.find(item => item.product_id === product_id);

                if (existingCartDetail) {
                    // Nếu sản phẩm đã có, cập nhật số lượng
                    existingCartDetail.quantity += quantity;
                    await existingCartDetail.save();
                    return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công' });
                } else {
                    // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới CartDetail
                    const newCartDetail = await CartDetail.create({
                        cart_id: cart.cart_id, // Sử dụng cart_id từ giỏ hàng hiện tại
                        product_id,
                        product_detail_id: productDetail.product_detail_id, // Truyền product_detail_id
                        quantity,
                    });
                    return res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
                }
            } else {
                // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng và CartDetail
                const newCart = await Cart.create({ user_id });

                const newCartDetail = await CartDetail.create({
                    cart_id: newCart.cart_id,
                    product_id,
                    product_detail_id: productDetail.product_detail_id, // Truyền product_detail_id khi tạo CartDetail
                    quantity,
                });

                return res.status(200).json({ message: 'Tạo giỏ hàng mới và thêm sản phẩm thành công' });
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
            const { cart_detail_id } = req.params;
            const cartItem = await CartDetail.findbyPk(cart_detail_id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            cartItem.quantity += 1;
            await cartItem.save();
            res.status(200).json({ message: 'Quantity increased', cartItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error increasing quantity' });
        }
    }
}

module.exports = cartController;