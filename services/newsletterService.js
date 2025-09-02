const { sheets } = require('../config/googleSheets');

class NewsletterService {
  // Aggiunge email alla newsletter
  async subscribeEmail(emailData) {
    try {
      const { email, source = 'Website', language = 'it' } = emailData;

      // Validazione email
      if (!email || !email.includes('@')) {
        throw new Error('Email non valida');
      }

      // Verifica se l'email esiste già
      try {
        const existingEmailsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
          range: `${process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Newsletter'}!A:A`,
        });

        const rows = existingEmailsResponse.data.values || [];
        const existingEmails = rows.slice(1).map(row => row[0]?.toLowerCase().trim());
        
        if (existingEmails.includes(email.toLowerCase().trim())) {
          throw new Error('Email già registrata alla newsletter');
        }
      } catch (error) {
        console.log('Errore nel controllo email esistente (continua comunque):', error);
      }

      // Aggiungi l'email al foglio
      const values = [
        [
          email,
          new Date().toISOString(),
          source,
          language
        ],
      ];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
        range: `${process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Newsletter'}!A:D`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });

      return { 
        success: true, 
        message: 'Email aggiunta alla newsletter con successo',
        data: response.data 
      };
    } catch (error) {
      console.error('Errore nell\'aggiunta email newsletter:', error);
      throw error;
    }
  }

  // Legge tutte le email della newsletter
  async getAllEmails() {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
        range: `${process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Newsletter'}!A:D`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      // Rimuove l'intestazione e converte i dati
      const emails = rows.slice(1).map((row, index) => ({
        id: index + 1,
        email: row[0] || '',
        date: row[1] || '',
        source: row[2] || 'Website',
        language: row[3] || 'it',
      }));

      return emails;
    } catch (error) {
      console.error('Errore nella lettura email newsletter:', error);
      throw new Error('Impossibile leggere le email newsletter');
    }
  }

  // Testa la connessione al foglio newsletter
  async testConnection() {
    try {
      await sheets.spreadsheets.get({
        spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
      });
      return { 
        success: true, 
        message: 'Connessione al foglio newsletter riuscita' 
      };
    } catch (error) {
      console.error('Errore nella connessione al foglio newsletter:', error);
      return { 
        success: false, 
        message: 'Errore nella connessione al foglio newsletter' 
      };
    }
  }
}

module.exports = new NewsletterService();
