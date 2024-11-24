const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // adjust the import path as needed

const authController = {

    // Đăng ký
    async registerUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                    email,
                    password: hashedPassword
                }
            });

            if (!created) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            const { password: _, ...userWithoutPassword } = user.dataValues;
            res.status(201).json({ message: 'Đăng ký thành công', user: userWithoutPassword });
        } catch (error) {
            res.status(400).json({ message: `Đã xảy ra lỗi trong quá trình đăng ký: ${error.message}` });
        }
    },

    // Đăng nhập
    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: "Email không tồn tại" });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: "Mật khẩu không đúng" });
            }

            const token = jwt.sign(
                { id: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ message: `Lỗi đăng nhập: ${error.message}` });
        }
    },
    async checkToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Không có token, bạn cần đăng nhập." });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token không hợp lệ." });
        }

        try {
            jwt.verify(token, 'secret', (err, user) => {
                if (err) {
                    return res.status(401).json({ message: "Token không hợp lệ." });
                }
                req.user = user;
                res.status(200).json({
                    message: "Token hợp lệ.",
                    user: req.user,
                });
                // next();
            });
        } catch (err) {
            return res.status(500).json({ message: "Lỗi server khi xác thực token." });
        }
    }

}

module.exports = authController;

