const bookingService = require('../services/bookingService');

class BookingController {
  // GET /api/bookings/test-connection - Testa la connessione a Google Sheets
  async testConnection(req, res) {
    try {
      const result = await bookingService.testConnection();
      res.json(result);
    } catch (error) {
      console.error('Errore nel controller testConnection:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

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
      console.log('📝 DEBUG createBooking - Dati ricevuti:', JSON.stringify(req.body, null, 2));
      console.log('📝 DEBUG createBooking - Headers:', req.headers);
      
      const result = await bookingService.createBooking(req.body);
      console.log('✅ DEBUG createBooking - Risultato:', JSON.stringify(result, null, 2));
      res.json(result);
    } catch (error) {
      console.error('❌ DEBUG createBooking - Errore completo:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
