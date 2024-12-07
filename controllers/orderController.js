const { where } = require('sequelize');
const { Order, OrderDetail, ProductDetail, sequelize } = require('../models');

const orderController = {
    async createOrder(req, res) {
        console.log('--- [START] Create Order ---');

        const { id: user_id } = req.user; // Lấy user_id từ token hoặc middleware
        console.log('User ID from token:', user_id);

        if (!user_id) {
            console.log('Error: user_id is missing');
            return res.status(400).json({ message: 'user_id is required' });
        }

        const {
            total_price,
            order_status,
            payment_method,
            order_details,
        } = req.body;

        console.log('Request body received:', {
            total_price,
            order_status,
            payment_method,
            order_details,
        });

        // Kiểm tra dữ liệu đầu vào
        if (!total_price || !payment_method || !Array.isArray(order_details) || order_details.length === 0) {
            console.log('Error: Invalid data in request body');
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ. Cần có total_price, payment_method, và order_details.',
            });
        }

        try {
            console.log('Creating new order...');
            const newOrder = await Order.create({
                user_id,
                total_price,
                order_status: order_status || 'Chờ xử lý',
                payment_method,
            });

            console.log('New order created:', newOrder);

            console.log('Creating order details...');
            const orderDetailPromises = order_details.map(async (item) => {
                console.log('Processing order detail:', item);
                return await OrderDetail.create({
                    quantity: item.quantity,
                    total_amount: item.total_amount,
                    orders_id: newOrder.orders_id,
                    product_detail_id: item.product_detail_id,
                });
            });

            await Promise.all(orderDetailPromises);
            console.log('Order details created successfully.');

            res.status(201).json({
                message: 'Đơn hàng đã được tạo thành công!',
                order: newOrder,
            });
        } catch (error) {
            console.error('Error occurred during order creation:', error.message);

            res.status(500).json({
                message: 'Đã có lỗi xảy ra khi tạo đơn hàng.',
                error: error.message,
            });
        }

        console.log('--- [END] Create Order ---');
    },
    async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetail',
                        include: [
                            {
                                model: ProductDetail,
                                as: 'productDetail',
                            },
                        ],
                    },
                ],
                order: [['orders_id', 'DESC']],
            });
            console.log(`Found ${orders.length} orders.`);

            res.status(200).json({
                message: 'Lấy danh sách đơn hàng thành công!',
                orders,
            });
        } catch (error) {
            console.error('Error occurred while retrieving orders:', error.message);
            res.status(500).json({
                message: 'Đã có lỗi xảy ra khi lấy danh sách đơn hàng.',
                error: error.message,
            });
        }
    },
    async confirmOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: "Đơn hàng không tồn tại" });
            }
            order.order_status = "Đã xác nhận";
            await order.save();

            res.json(order);
        } catch (error) {
            console.error("Lỗi khi xác nhận đơn hàng:", error);
            res.status(500).json({ message: "Đã xảy ra lỗi khi xác nhận đơn hàng" });
        }
    },
    async cancelOrder(req, res) {
        const { id } = req.params;

        try {
            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
            }

            if (order.order_status !== 'Chờ xử lý') {
                return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xử lý".' });
            }

            order.order_status = 'Đã hủy';
            await order.save();

            return res.status(200).json({ message: 'Đơn hàng đã được hủy thành công.' });
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error.message);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đơn hàng.' });
        }
    },
    async getOrderById(req, res) {
        const { id } = req.params;
        try {
            console.log('Start finding order...');
            const order = await Order.findAll({
                where: { user_id: id },
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetail',
                        include: [
                            {
                                model: ProductDetail,
                                as: 'productDetail',
                            },
                        ],
                    },
                ],
            });
            console.log('Order found:', order);
            if (!order) {
                console.log('Order is null or not found');
                return res.status(404).json({
                    message: 'Đơn hàng không tồn tại.',
                });
            }
            console.log(`Found order with ID ${id}.`);
            res.status(200).json({
                message: 'Lấy thông tin đơn hàng thành công!',
                order,
            });
        } catch (error) {
            console.error('Error occurred:', error.message);
        }

    },
    async updateStatus(req, res) {
        const { id } = req.params;
        const { order_status } = req.body;

        try {
            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.order_status = order_status;
            await order.save();

            res.status(200).json({ message: 'Order status updated successfully', order });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = orderController;
