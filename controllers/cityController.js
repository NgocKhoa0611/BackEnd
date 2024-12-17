const { City } = require('../models');

const cityController = {
    async getAllCities(req, res) {
        try {
            const cities = await City.findAll();
            res.status(200).json(cities);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy danh sách thành phố: ${error.message}` });
        }
    },

    async getCityById(req, res) {
        const { id } = req.params;
        try {
            const city = await City.findByPk(id);
            if (!city) {
                return res.status(404).json({ message: 'Thành phố không tồn tại' });
            }
            res.status(200).json(city);
        } catch (error) {
            res.status(500).json({ message: `Lỗi khi lấy thông tin thành phố: ${error.message}` });
        }
    },
};

module.exports = cityController;
