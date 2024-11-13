const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err); // Log chi tiết lỗi
            return res.status(403).json({ message: 'Token không hợp lệ hoặc không tồn tại' });
        }
        req.user = decoded
        next();
    });
};

module.exports = authenticateToken;


