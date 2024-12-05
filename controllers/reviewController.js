const { Review, ProductDetail } = require('../models'); // Adjust the import path as needed

const reviewController = {
    // Tạo mới review
    async createReview(req, res) {
        const { content, date, user_id, product_detail_id } = req.body;

        if (!content || !date || !user_id || !product_detail_id) {
            return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc' });
        }

        try {
            const productDetail = await ProductDetail.findByPk(product_detail_id);
            if (!productDetail) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
            }

            const newReview = await Review.create({ content, date, user_id, product_detail_id });
            res.status(201).json({ message: 'Tạo review thành công', review: newReview });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi tạo review: ${error.message}` });
        }
    },

    // Lấy danh sách review
    async getAllReviews(req, res) {
        try {
            const reviews = await Review.findAll({
                include: [
                    {
                        model: ProductDetail,
                        as: 'productDetail',
                        attributes: ['product_detail_id', 'product_id'],
                    },
                ],
            });
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách review: ${error.message}` });
        }
    },

    // Lấy thông tin chi tiết review
    async getReviewById(req, res) {
        const { id } = req.params;

        try {
            const review = await Review.findByPk(id, {
                include: [
                    {
                        model: ProductDetail,
                        as: 'productDetail',
                        attributes: ['product_detail_id', 'product_id'],
                    },
                ],
            });

            if (!review) {
                return res.status(404).json({ message: 'Không tìm thấy review' });
            }
            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy thông tin review: ${error.message}` });
        }
    },

    // Cập nhật review
    async updateReview(req, res) {
        const { id } = req.params;
        const { content, date } = req.body;

        try {
            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Không tìm thấy review' });
            }

            review.content = content || review.content;
            review.date = date || review.date;
            await review.save();

            res.status(200).json({ message: 'Cập nhật review thành công', review });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi cập nhật review: ${error.message}` });
        }
    },

    // Xóa review
    async deleteReview(req, res) {
        const { id } = req.params;

        try {
            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Không tìm thấy review' });
            }

            await review.destroy();
            res.status(200).json({ message: 'Xóa review thành công' });
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi xóa review: ${error.message}` });
        }
    },
};

module.exports = reviewController;
