const express = require('express');
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');

const router = express.Router();

// GET /api/bookings/test-connection - Testa la connessione a Google Sheets
router.get('/test-connection', bookingController.testConnection);

// GET /api/bookings - Ottiene tutte le prenotazioni
router.get('/', bookingController.getAllBookings);

// POST /api/bookings - Crea una nuova prenotazione (con validazione)
router.post('/', validateBooking, bookingController.createBooking);

// GET /api/bookings/stats - Ottiene statistiche delle prenotazioni
router.get('/stats', bookingController.getStats);

module.exports = router;
