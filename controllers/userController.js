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
    }

}

module.exports = userController;