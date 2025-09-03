const { sheets, testConnection } = require('../config/googleSheets');
const newsletterService = require('./newsletterService');

class BookingService {
  // Testa la connessione a Google Sheets
  async testConnection() {
    try {
      const result = await testConnection();
      return result;
    } catch (error) {
      console.error('Errore nel test di connessione booking:', error);
      return { success: false, message: 'Errore nella connessione a Google Sheets' };
    }
  }
  // Legge tutte le prenotazioni
  async getAllBookings() {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${process.env.GOOGLE_SHEET_NAME}!A:I`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      // Rimuove l'intestazione e converte i dati
      const bookings = rows.slice(1).map((row, index) => ({
        id: index + 1,
        date: row[0] || '',
        time: row[1] || '',
        name: row[2] || '',
        phone: row[3] || '',
        email: row[4] || '',
        guests: parseInt(row[5]) || 0,
        notes: row[6] || '',
        status: row[7] || 'Pendente',
        timestamp: row[8] || new Date().toISOString(),
      }));

      return bookings;
    } catch (error) {
      console.error('Errore nella lettura delle prenotazioni:', error);
      throw new Error('Impossibile leggere le prenotazioni da Google Sheets');
    }
  }

  // Aggiunge una nuova prenotazione
  async createBooking(bookingData) {
    try {
      const { date, time, name, phone, email, guests, notes } = bookingData;

      // Validazione base
      if (!date || !time || !name || !phone || !guests) {
        throw new Error('Campi obbligatori mancanti');
      }

      // Formatta il numero di telefono per evitare errori su Google Sheets
      // Rimuove caratteri che potrebbero causare problemi e forza il formato testo
      const formattedPhone = phone.toString().trim();
      
      const values = [
        [
          date,
          time,
          name,
          `="${formattedPhone}"`, // Usa formula per forzare il testo e evitare interpretazioni errate
          email || '',
          guests.toString(),
          notes || '',
          'Pendente',
          new Date().toISOString(),
        ],
      ];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${process.env.GOOGLE_SHEET_NAME}!A:I`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });

      // Se è stata fornita un'email, aggiungila automaticamente alla newsletter
      if (email && email.trim()) {
        try {
          await newsletterService.subscribeEmail({
            email: email.trim(),
            source: 'Prenotazione',
            language: 'it'
          });
          console.log(`Email ${email} aggiunta automaticamente alla newsletter dalla prenotazione`);
        } catch (newsletterError) {
          // Non bloccare la prenotazione se l'aggiunta alla newsletter fallisce
          console.warn('Errore nell\'aggiunta automatica alla newsletter:', newsletterError.message);
        }
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Errore nell\'aggiunta della prenotazione:', error);
      throw new Error('Impossibile aggiungere la prenotazione a Google Sheets');
    }
  }

  // Ottiene statistiche delle prenotazioni
  async getStats() {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${process.env.GOOGLE_SHEET_NAME}!A:I`,
      });

      const rows = response.data.values || [];
      const bookings = rows.slice(1);

      const stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b[7] === 'Pendente').length,
        confirmedBookings: bookings.filter(b => b[7] === 'Confermato').length,
        cancelledBookings: bookings.filter(b => b[7] === 'Cancellato').length,
        totalGuests: bookings.reduce((sum, b) => sum + (parseInt(b[5]) || 0), 0),
      };

      return stats;
    } catch (error) {
      console.error('Errore nel recupero statistiche:', error);
      throw new Error('Impossibile recuperare le statistiche');
    }
  }
}

module.exports = new BookingService();
