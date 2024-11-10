const { Cart, CartDetail } = require('../models');

const cartController = {
    async getCart(req, res) {
        try {
            const { user_id } = req.query;
            if (!user_id) {
                return res.status(400).json({ message: 'user_id is required' });
            }
            const cartItems = await CartDetail.findAll({
                where: { user_id },
                include: [{ model: Cart, where: { user_id } }]
            });
            res.status(200).json({ cart: cartItems });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    },
    async addCart(req, res) {
        try {
            const { user_id, products } = req.body;
            if (!user_id || !products || products.length === 0) {
                return res.status(400).json({ message: 'user_id and products are required' });
            }
            const cart = await Cart.create({ user_id });
            const cartDetails = products.map((product) => ({
                cart_id: cart.cart_id,
                product_detail_id: product.product_detail_id,
                quantity: product.quantity,
                price: product.price,
            }));
            await CartDetail.bulkCreate(cartDetails);
            res.status(201).json({ message: 'Cart saved successfully', cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving cart' });
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