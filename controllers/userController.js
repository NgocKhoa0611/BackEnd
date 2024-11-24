const { User } = require('../models');

const userController = {
    async getAllUser(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách người dùng: ${error.message}` });
        }
    },
    async getUserbyId(req, res) {
        try {
            const user = await User.findByPk(req.params.id,
                { attributes: { exclude: ['password'] } }
            );
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            } else
                res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: `Lỗi khi lấy thông tin người dùng: ${error.message}` });
        }
    },
    // Thêm người dùng mới
    async createUser(req, res) {
        try {
            const { name, email, password, is_locked } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Thông tin không đầy đủ' });
            }

            const newUser = await User.create({ name, email, password, is_locked: is_locked || false });
            res.status(201).json(newUser);
        } catch (error) {
            console.error(`Error creating user: ${error.message}`);
            res.status(500).json({ message: `Lỗi khi thêm người dùng: ${error.message}` });
        }
    },

    // Sửa thông tin người dùng
    async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
            }

            const { name, email, password, is_locked } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Cập nhật thông tin
            await user.update({ name, email, password, is_locked });
            res.status(200).json(user);
        } catch (error) {
            console.error(`Error updating user: ${error.message}`);
            res.status(500).json({ message: `Lỗi khi sửa người dùng: ${error.message}` });
        }
    },

    // Khóa người dùng
    async lockUser(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Khóa người dùng
            await user.update({ is_locked: true });
            res.status(200).json({ message: 'Người dùng đã bị khóa', user });
        } catch (error) {
            console.error(`Error locking user: ${error.message}`);
            res.status(500).json({ message: `Lỗi khi khóa người dùng: ${error.message}` });
        }
    }
};

module.exports = userController;