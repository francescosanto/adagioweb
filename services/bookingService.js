const { sheets, testConnection } = require('../config/googleSheets');

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

      const values = [
        [
          date,
          time,
          name,
          `'${phone}`, // Aggiunge apostrofo per forzare il testo in Google Sheets
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
