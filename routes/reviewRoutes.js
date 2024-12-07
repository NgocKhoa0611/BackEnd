const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/review/:id', reviewController.deleteReview);

module.exports = router;
