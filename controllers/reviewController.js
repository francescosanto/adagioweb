const reviewService = require('../services/reviewService');

class ReviewController {
  // GET /api/reviews - Ottiene le recensioni Google
  async getGoogleReviews(req, res) {
    try {
      const result = await reviewService.getGoogleReviews();
      res.json(result);
    } catch (error) {
      console.error('Errore nel controller getGoogleReviews:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/reviews/test-place-id - Testa il Place ID esistente
  async testPlaceId(req, res) {
    try {
      const result = await reviewService.testPlaceId();
      if (result) {
        res.json({ success: true, place: result });
      } else {
        res.json({ success: false, message: 'Place ID non valido o errore API' });
      }
    } catch (error) {
      console.error('Errore nel controller testPlaceId:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/reviews/search-place-id - Cerca un nuovo Place ID
  async searchPlaceId(req, res) {
    try {
      const { name, location } = req.query;
      if (!name || !location) {
        return res.status(400).json({ 
          success: false,
          error: 'Parametri name e location richiesti' 
        });
      }
      
      const placeId = await reviewService.searchRestaurantPlaceId(name, location);
      if (placeId) {
        res.json({ success: true, placeId });
      } else {
        res.json({ success: false, message: 'Nessun luogo trovato' });
      }
    } catch (error) {
      console.error('Errore nel controller searchPlaceId:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new ReviewController();
