const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');
const upload = require('../middleware/upload');

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
    createProductDetail: [
        upload.single('product_image'), // Xử lý upload một file
        async (req, res) => {
            try {
                console.log('Request body:', req.body); // Kiểm tra dữ liệu gửi lên
                console.log('File:', req.file); // Kiểm tra thông tin file nếu có

                const {
                    size_id,
                    color_id,
                    product_id,
                    description,
                    quantity,
                    is_hidden,
                    isFeatured,
                    isHot,
                    is_primary
                } = req.body;

                // Kiểm tra sản phẩm tồn tại
                const product = await Product.findByPk(product_id);
                if (!product) {
                    return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
                }

                // Kiểm tra size_id và color_id hợp lệ
                const size = await Size.findByPk(size_id);
                if (!size) {
                    return res.status(400).json({ message: 'Kích cỡ không hợp lệ' });
                }

                const color = await Color.findByPk(color_id);
                if (!color) {
                    return res.status(400).json({ message: 'Màu sắc không hợp lệ' });
                }

                // Tạo sản phẩm chi tiết
                const newProductDetail = await ProductDetail.create({
                    size_id,
                    color_id,
                    product_id,
                    description,
                    quantity: quantity || 0, // Giá trị mặc định nếu không gửi
                    is_hidden: is_hidden || false, // Giá trị mặc định nếu không gửi
                    isFeatured: isFeatured || false,
                    isHot: isHot || false,
                    is_primary: is_primary || true
                });

                // Nếu có file, tạo thông tin trong ProductImage
                if (req.file) {
                    await ProductImage.create({
                        product_detail_id: newProductDetail.product_detail_id,
                        img_url: `/img/${req.file.filename}`, // Đường dẫn ảnh
                        is_primary: true // Giả định ảnh đầu tiên là ảnh chính
                    });
                }

                res.status(201).json({
                    message: 'Chi tiết sản phẩm đã được thêm thành công',
                    data: newProductDetail
                });
            } catch (error) {
                console.error('Error while creating product detail:', error);
                res.status(500).json({ message: `Lỗi khi thêm chi tiết sản phẩm: ${error.message}` });
            }
        }
    ]
};

module.exports = detailController;
