const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = file.fieldname === 'product_image' ? './public/img' : './public/avatar';
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Chỉ được upload file ảnh!'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
