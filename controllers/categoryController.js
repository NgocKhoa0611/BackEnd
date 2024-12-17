const { Category } = require('../models');

const categoryController = {
    // Lấy danh sách danh mục
    async getAllCategory(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách danh mục: ${error.message}` });
        }
    },

    // Lấy danh sách danh mục theo Id
    async getCategoryByID(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh mục: ${error.message}` });
        }
    },

    // Thêm danh mục
    async addCategory(req, res) {
        try {
            const { category_parent_id, category_name } = req.body;
            if (!category_name) {
                return res.status(400).json({ message: 'Tên danh mục là bắt buộc' })
            }
            const newCategory = await Category.create({
                category_parent_id: category_parent_id || null,
                category_name
            });

            return res.status(201).json({
                message: 'Thêm danh mục thành công',
                category: newCategory,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Có lõi xảy ra khi thêm danh mục' });
        }
    },

    // Ẩn danh mục
    async hideCategory(req, res) {
        const { id } = req.params;
        console.log('Category ID:', id);
        try {
            const category = await Category.findByPk(id);
            console.log(category);


            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }

            category.is_hidden = true;
            await category.save();

            res.status(200).json({ message: 'Danh mục đã được ẩn thành công', category });
        } catch (error) {
            console.error('Lỗi khi ẩn danh mục:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi ẩn danh mục' });
        }
    },

    // Hiện danh mục
    async showCategory(req, res) {
        const { id } = req.params;
        console.log('Category ID:', id);
        try {
            const category = await Category.findByPk(id);
            console.log(category);

            if (!category) {
                return res.status(404).json({ message: 'Danh mục không tồn tại' });
            }
            category.is_hidden = false;
            await category.save();

            res.status(200).json({ message: 'Danh mục đã được hiển thị thành công', category });
        } catch (error) {
            console.error('Lỗi khi hiển thị danh mục:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi hiển thị danh mục' });
        }
    },

    // Cập nhật danh mục
    async updateCategory(req, res) {
        const { id } = req.params;
        const { category_id, category_parent_id, category_name } = req.body;
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Danh mục không tồn tại" });
            }
            if (category_id !== undefined) category.category_id = category_id;
            if (category_parent_id !== undefined) category.category_parent_id = category_parent_id;
            if (category_name !== undefined) category.category_name = category_name;

            await category.save();
            res.status(200).json({ message: "Danh mục đã được cập nhật thành công", category });
        } catch (error) {
            console.log("Lỗi khi cập nhật danh mục:", error);
            res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật danh mục" })
        }
    },
    // Đếm tổng số danh mục
    async countCategories(req, res) {
        try {
            const count = await Category.count();
            if (count !== null) {
                res.status(200).json({ total: count });
            } else {
                res.status(404).json({ message: "Không tìm thấy danh mục nào." });
            }
        } catch (error) {
            console.error("Lỗi khi đếm danh mục:", error);
            res.status(500).json({ message: `Lỗi khi đếm danh mục: ${error.message}` });
        }
    }
}

module.exports = categoryController;