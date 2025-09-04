const { google } = require('googleapis');
const path = require('path');

// Configurazione Google Sheets - Supporta sia file JSON che variabili d'ambiente
let auth;

if (process.env.GOOGLE_PRIVATE_KEY) {
  // Usa le variabili d'ambiente (per Render/Heroku)
  auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  // Usa il file JSON (per sviluppo locale)
  auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../service-account-key.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

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
