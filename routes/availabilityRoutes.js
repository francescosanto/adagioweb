const express = require('express');
const availabilityController = require('../controllers/availabilityController');

const router = express.Router();

// GET /api/availability/:date - Verifica la disponibilità per una data
router.get('/:date', (req, res, next) => {
  console.log(`📅 Chiamata disponibilità per data: ${req.params.date}`);
  next();
}, availabilityController.getAvailability);

// GET /api/availability/:date/:time - Verifica disponibilità per orario specifico
router.get('/:date/:time', availabilityController.checkTimeSlot);

module.exports = router;
