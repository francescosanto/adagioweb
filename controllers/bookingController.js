const bookingService = require('../services/bookingService');

class BookingController {
  // GET /api/bookings - Ottiene tutte le prenotazioni
  async getAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Errore nel controller getAllBookings:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // POST /api/bookings - Crea una nuova prenotazione
  async createBooking(req, res) {
    try {
      const result = await bookingService.createBooking(req.body);
      res.json(result);
    } catch (error) {
      console.error('Errore nel controller createBooking:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/bookings/stats - Ottiene statistiche delle prenotazioni
  async getStats(req, res) {
    try {
      const stats = await bookingService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Errore nel controller getStats:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new BookingController();
