const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Kiểm tra và tạo thư mục nếu chưa tồn tại
const folderPath = path.resolve(__dirname, '../public/img');  // Sử dụng đường dẫn tuyệt đối
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folderPath); // Lưu ảnh vào thư mục public/img
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); // Lấy đuôi file
        const fileName = `${timestamp}-${file.originalname}`;
        cb(null, fileName); // Tạo tên file duy nhất
    }
});

const fileFilter = (req, file, cb) => {
    // Chỉ cho phép upload các file ảnh
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Chỉ được upload file ảnh!'), false);
    }
    cb(null, true); // Cho phép file hợp lệ
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // Giới hạn kích thước file 5MB
});

module.exports = upload;
