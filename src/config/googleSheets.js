import { google } from 'googleapis';
import { config } from './config';

// Configurazione Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = config.googleSheetId;
const SHEET_NAME = config.googleSheetName;
const MAX_CAPACITY = config.maxCapacity;

// Inizializza l'autenticazione
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json', // File aggiornato per il nuovo account
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Funzione per leggere tutte le prenotazioni
export const readBookings = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:I`, // Legge tutte le colonne
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

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
};

// Funzione per aggiungere una nuova prenotazione
export const addBooking = async (bookingData) => {
  try {
    const values = [
      [
        bookingData.date,
        bookingData.time,
        bookingData.name,
        `'${bookingData.phone}`, // Aggiunge apostrofo per forzare il testo in Google Sheets
        bookingData.email,
        bookingData.guests.toString(),
        bookingData.notes,
        'Pendente',
        new Date().toISOString(),
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });

    return response.data;
  } catch (error) {
    console.error('Errore nell\'aggiunta della prenotazione:', error);
    throw new Error('Impossibile aggiungere la prenotazione a Google Sheets');
  }
};

// Funzione per verificare la disponibilità
export const checkAvailability = async (date, time) => {
  try {
    const bookings = await readBookings();
    const conflictingBookings = bookings.filter(
      booking => 
        booking.date === date && 
        booking.time === time && 
        booking.status !== 'Cancellato'
    );

    // Conta le persone già prenotate per quell'orario
    const totalGuests = conflictingBookings.reduce((sum, booking) => sum + booking.guests, 0);
    const availableCapacity = MAX_CAPACITY - totalGuests;

    if (availableCapacity <= 0) return { available: false, capacity: 0, reason: 'Completo' };
    if (availableCapacity <= 10) return { available: true, capacity: availableCapacity, reason: 'Quasi pieno' };
    return { available: true, capacity: availableCapacity, reason: 'Libero' };
  } catch (error) {
    console.error('Errore nel controllo disponibilità:', error);
    return { available: false, capacity: 0, reason: 'Errore' };
  }
};

// Funzione per ottenere la disponibilità per tutti gli orari di una data
export const getAvailabilityForDate = async (date) => {
  const availability = {};
  
  for (const time of config.timeSlots) {
    const status = await checkAvailability(date, time);
    availability[time] = status;
  }

  return availability;
};

// Funzione per verificare la connessione a Google Sheets
export const testConnection = async () => {
  try {
    await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    return { success: true, message: 'Connessione a Google Sheets riuscita' };
  } catch (error) {
    console.error('Errore nella connessione a Google Sheets:', error);
    return { success: false, message: 'Errore nella connessione a Google Sheets' };
  }
};
