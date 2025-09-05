const newsletterService = require('../services/newsletterService');

class NewsletterController {
  // POST /api/newsletter/subscribe - Aggiunge email alla newsletter
  async subscribeEmail(req, res) {
    try {
      const result = await newsletterService.subscribeEmail(req.body);
      
      // Se è un duplicato, restituisci 200 con messaggio informativo
      if (result.duplicate) {
        return res.status(200).json({
          success: true,
          message: 'Email già registrata alla newsletter',
          duplicate: true
        });
      }
      
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

  // GET /api/newsletter/debug-env - Debug delle variabili d'ambiente
  async debugEnv(req, res) {
    try {
      const envVars = {
        NEWSLETTER_SHEET_ID: process.env.NEWSLETTER_SHEET_ID ? 'Presente' : 'Mancante',
        NEWSLETTER_SHEET_NAME: process.env.NEWSLETTER_SHEET_NAME || 'Non impostato',
        REACT_APP_NEWSLETTER_SHEET_ID: process.env.REACT_APP_NEWSLETTER_SHEET_ID ? 'Presente' : 'Mancante',
        REACT_APP_NEWSLETTER_SHEET_NAME: process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Non impostato',
        NODE_ENV: process.env.NODE_ENV || 'Non impostato'
      };
      
      res.json({
        success: true,
        message: 'Variabili d\'ambiente newsletter',
        data: envVars
      });
    } catch (error) {
      console.error('Errore nel controller debugEnv:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new NewsletterController();
