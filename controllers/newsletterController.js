const newsletterService = require('../services/newsletterService');

class NewsletterController {
  // POST /api/newsletter/subscribe - Aggiunge email alla newsletter
  async subscribeEmail(req, res) {
    try {
      const result = await newsletterService.subscribeEmail(req.body);
      res.json(result);
    } catch (error) {
      console.error('Errore nel controller subscribeEmail:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/newsletter/emails - Ottiene tutte le email della newsletter
  async getAllEmails(req, res) {
    try {
      const emails = await newsletterService.getAllEmails();
      res.json(emails);
    } catch (error) {
      console.error('Errore nel controller getAllEmails:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // GET /api/newsletter/test-connection - Testa la connessione al foglio newsletter
  async testConnection(req, res) {
    try {
      const result = await newsletterService.testConnection();
      res.json(result);
    } catch (error) {
      console.error('Errore nel controller testConnection:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new NewsletterController();
