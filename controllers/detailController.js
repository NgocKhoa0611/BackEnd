    const { Product, ProductDetail, Size, Color, ProductImage } = require('../models');
    const upload = require('../middleware/upload')

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
            upload.single('product_image'), // Handle single file upload
            async (req, res) => {
                try {
                    console.log('Request body:', req.body); // Kiểm tra dữ liệu gửi lên
                    console.log('File:', req.file); // Kiểm tra thông tin file nếu có
         
                    const { size_id, color_id,} = req.body;
         
                    // Ensure the product exists
                    const product = await Product.findByPk(product_id);
                    if (!product) {
                        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
                    }
         
                    // Create product detail
                    const newProductDetail = await ProductDetail.create({
                        size_id,
                        color_id,
                       
                    });
         
                    // If file is uploaded, save image info in ProductImage
                    if (req.file) {
                        await ProductImage.create({
                            product_detail_id: newProductDetail.product_detail_id,
                            image_url: `/img/${req.file.filename}`,  // Path to the uploaded image
                        });
                    }
         
                    res.status(201).json({
                        message: 'Chi tiết sản phẩm đã được thêm thành công',
                        data: newProductDetail,
                    });
                } catch (error) {
                    console.error('Error while creating product detail:', error);
                    res.status(500).json({ message: `Lỗi khi thêm chi tiết sản phẩm: ${error.message}` });
                }
            }
         ]
         
    }

    module.exports = detailController;