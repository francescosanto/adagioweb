const availabilityService = require('../services/availabilityService');

class AvailabilityController {
  // GET /api/availability/:date - Verifica la disponibilità per una data
  async getAvailability(req, res) {
    try {
      const { date } = req.params;
      const availability = await availabilityService.getAvailability(date);
      res.json(availability);
    } catch (error) {
      console.error('Errore nel controller getAvailability:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/availability/:date/:time - Verifica disponibilità per orario specifico
  async checkTimeSlot(req, res) {
    try {
      const { date, time } = req.params;
      const availability = await availabilityService.checkTimeSlotAvailability(date, time);
      res.json(availability);
    } catch (error) {
      console.error('Errore nel controller checkTimeSlot:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new AvailabilityController();
