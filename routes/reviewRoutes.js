const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/review', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/review/:id', reviewController.getReviewById);
router.put('/review/:id', reviewController.updateReview);
router.delete('/review/:id', reviewController.deleteReview);

module.exports = router;
