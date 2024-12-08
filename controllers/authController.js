const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require("crypto");

const authController = {
    // Đăng ký
    async registerUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const confirmationToken = crypto.randomBytes(32).toString("hex");
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                    email,
                    password: hashedPassword,
                    confirmation_token: confirmationToken,
                    is_confirmed: false,
                }
            });

            if (!created) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Xác nhận tài khoản Fashionverse',
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
                            <h1 style="color: #0F3460; text-align: center; font-size: 24px;">Chào mừng bạn đến với FASHIONVERSE</h1>
                            <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">
                                Nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:
                            </p>
                            <div style="text-align: center;">
                                <a href="http://localhost:8000/auth/confirm-account?email=${email}&token=${confirmationToken}" 
                                style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #0F3460; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                    Xác nhận tài khoản
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
                                Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.
                            </p>
                        </div>`

            };

            console.log('Bắt đầu gửi email...');
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Lỗi khi gửi email:", error);
                    return res.status(500).json({ message: 'Không thể gửi email xác nhận' });
                } else {
                    console.log("Email đã được gửi thành công:", info.response);
                    const { password: _, ...userWithoutPassword } = user.dataValues;
                    return res.status(201).json({ message: 'Đăng ký thành công', user: userWithoutPassword });
                }
            });
        } catch (error) {
            res.status(400).json({ message: `Đã xảy ra lỗi trong quá trình đăng ký: ${error.message}` });
        }
    },
    async confirmAccount(req, res) {
        const { email, token } = req.query;
        console.log('Email:', email);
        console.log('Token:', token);
        // Kiểm tra tính hợp lệ của email và token
        if (!email || !token) {
            return res.status(400).json({ message: 'Thông tin không hợp lệ' });
        }

        try {
            // Tìm người dùng bằng email và token
            const user = await User.findOne({ where: { email, confirmation_token: token } });

            if (!user) {
                return res.status(400).json({ message: 'Liên kết xác nhận không hợp lệ hoặc đã hết hạn' });
            }

            // Cập nhật trạng thái xác nhận
            user.is_confirmed = true;
            user.confirmation_token = null; // Xóa token sau khi xác nhận
            await user.save();

            return res.status(200).json({ message: 'Tài khoản của bạn đã được xác nhận thành công' });
        } catch (error) {
            return res.status(500).json({ message: `Lỗi: ${error.message}` });
        }
    },
    // Đăng nhập
    async loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Thiếu email hoặc mật khẩu"); // Log kiểm tra đầu vào
            return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });
        }
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: "Email không tồn tại" });
            }
            if (!user.is_confirmed) {
                return res.status(403).json({ message: "Tài khoản của bạn chưa được xác nhận. Vui lòng kiểm tra email để xác nhận." });
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

