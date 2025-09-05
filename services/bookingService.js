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
      console.log('🔧 DEBUG bookingService.createBooking - Dati ricevuti:', JSON.stringify(bookingData, null, 2));
      console.log('🔧 DEBUG bookingService.createBooking - Variabili ambiente:', {
        GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'Presente' : 'Mancante',
        GOOGLE_SHEET_NAME: process.env.GOOGLE_SHEET_NAME || 'Non impostato',
        NODE_ENV: process.env.NODE_ENV || 'Non impostato'
      });
      
      const { date, time, name, phone, email, guests, notes } = bookingData;

      // Validazione base
      if (!date || !time || !name || !phone || !guests) {
        console.error('❌ DEBUG bookingService.createBooking - Validazione fallita:', {
          date: !!date,
          time: !!time,
          name: !!name,
          phone: !!phone,
          guests: !!guests
        });
        throw new Error('Campi obbligatori mancanti');
      }

      // Formatta il numero di telefono per evitare errori su Google Sheets
      // Rimuove caratteri che potrebbero causare problemi e forza il formato testo
      const formattedPhone = phone.toString().trim();
      
      // Converte la data da DD-MM-YYYY a formato leggibile per Google Sheets
      const [day, month, year] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      // Crea timestamp in formato locale italiano (UTC+1)
      const now = new Date();
      const italianTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // Aggiunge 2 ore per l'ora italiana
      const formattedTimestamp = italianTime.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const values = [
        [
          `="${formattedDate}"`, // Usa formula per forzare il testo e evitare interpretazione come numero
          time,
          name,
          `="${formattedPhone}"`, // Usa formula per forzare il testo e evitare interpretazioni errate
          email || '',
          guests.toString(),
          notes || '',
          'Pendente',
          formattedTimestamp,
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
          console.log(`Tentativo di aggiunta email ${email} alla newsletter...`);
          console.log('Variabili ambiente newsletter:', {
            NEWSLETTER_SHEET_ID: process.env.NEWSLETTER_SHEET_ID ? 'Presente' : 'Mancante',
            NEWSLETTER_SHEET_NAME: process.env.NEWSLETTER_SHEET_NAME || 'Non impostato'
          });
          
          const newsletterResult = await newsletterService.subscribeEmail({
            email: email.trim(),
            source: 'Prenotazione',
            language: 'it'
          });
          
          if (newsletterResult.duplicate) {
            console.log(`ℹ️ Email ${email} già presente nella newsletter, skip aggiunta`);
          } else {
            console.log(`✅ Email ${email} aggiunta automaticamente alla newsletter dalla prenotazione`);
          }
        } catch (newsletterError) {
          // Non bloccare la prenotazione se l'aggiunta alla newsletter fallisce
          console.error('❌ Errore nell\'aggiunta automatica alla newsletter:', newsletterError.message);
          console.error('Dettagli errore:', newsletterError);
        }
      } else {
        console.log('Nessuna email fornita nella prenotazione, skip newsletter');
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
