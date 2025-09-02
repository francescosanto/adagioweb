const { google } = require('googleapis');
const path = require('path');

// Configurazione Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../service-account-key.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Funzione per testare la connessione
const testConnection = async () => {
  try {
    await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    return { success: true, message: 'Connessione a Google Sheets riuscita' };
  } catch (error) {
    console.error('Errore nella connessione a Google Sheets:', error);
    return { success: false, message: 'Errore nella connessione a Google Sheets' };
  }
};

module.exports = {
  sheets,
  testConnection
};
