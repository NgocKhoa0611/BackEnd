const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Phân chia nơi lưu trữ dựa trên uploadType
        const folder = req.body.uploadType === 'product' ? './public/img' : './public/avatar';
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        // Đặt tên file với timestamp để tránh trùng lặp
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
function checkFileUpLoad(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

module.exports = upload;