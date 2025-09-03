import { google } from 'googleapis';
import { config } from './config';

// Configurazione Google Sheets per Newsletter
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const NEWSLETTER_SHEET_ID = config.newsletterSheetId;
const NEWSLETTER_SHEET_NAME = config.newsletterSheetName;

// Inizializza l'autenticazione
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json',
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Funzione per aggiungere una nuova email alla newsletter
export const addNewsletterEmail = async (emailData) => {
  try {
    const values = [
      [
        emailData.email,
        new Date().toISOString(),
        emailData.source || 'Website',
        emailData.language || 'it'
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: NEWSLETTER_SHEET_ID,
      range: `${NEWSLETTER_SHEET_NAME}!A:D`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Errore nell\'aggiunta dell\'email newsletter:', error);
    return { success: false, error: error.message };
  }
};

// Funzione per verificare se un'email esiste già
export const checkEmailExists = async (email) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEWSLETTER_SHEET_ID,
      range: `${NEWSLETTER_SHEET_NAME}!A:A`, // Legge solo la colonna email
    });

    const rows = response.data.values || [];
    const emails = rows.slice(1).map(row => row[0]?.toLowerCase().trim()); // Rimuove header e normalizza
    
    return emails.includes(email.toLowerCase().trim());
  } catch (error) {
    console.error('Errore nel controllo email esistente:', error);
    return false;
  }
};

// Funzione per leggere tutte le email della newsletter
export const readNewsletterEmails = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEWSLETTER_SHEET_ID,
      range: `${NEWSLETTER_SHEET_NAME}!A:D`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

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
    console.error('Errore nella lettura delle email newsletter:', error);
    throw new Error('Impossibile leggere le email newsletter da Google Sheets');
  }
};

// Funzione per verificare la connessione al foglio newsletter
export const testNewsletterConnection = async () => {
  try {
    await sheets.spreadsheets.get({
      spreadsheetId: NEWSLETTER_SHEET_ID,
    });
    return { success: true, message: 'Connessione al foglio newsletter riuscita' };
  } catch (error) {
    console.error('Errore nella connessione al foglio newsletter:', error);
    return { success: false, message: 'Errore nella connessione al foglio newsletter' };
  }
};
