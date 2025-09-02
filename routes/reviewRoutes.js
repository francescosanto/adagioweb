const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// GET /api/reviews - Ottiene le recensioni Google
router.get('/', reviewController.getGoogleReviews);

// GET /api/reviews/test-place-id - Testa il Place ID esistente
router.get('/test-place-id', reviewController.testPlaceId);

// GET /api/reviews/search-place-id - Cerca un nuovo Place ID
router.get('/search-place-id', reviewController.searchPlaceId);

module.exports = router;
