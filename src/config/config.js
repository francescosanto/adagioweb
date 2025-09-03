// Configurazione dell'applicazione
export const config = {
  // Google Sheets Configuration
  googleSheetId: process.env.REACT_APP_GOOGLE_SHEET_ID || 'YOUR_SHEET_ID_HERE',
  googleSheetName: process.env.REACT_APP_GOOGLE_SHEET_NAME || 'Sheet1',
  googleServiceAccountEmail: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL || 'your-service-account@project.iam.gserviceaccount.com',
  
  // Newsletter Google Sheets Configuration
  newsletterSheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID || 'YOUR_NEWSLETTER_SHEET_ID_HERE',
  newsletterSheetName: process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Newsletter',
  
  // App Configuration
  syncInterval: parseInt(process.env.REACT_APP_SYNC_INTERVAL) || 300000, // 5 minuti in millisecondi
  maxCapacity: parseInt(process.env.REACT_APP_MAX_CAPACITY) || 50,
  
  // Orari disponibili per giorno della settimana
  // 0 = Domenica, 1 = Lunedì, 2 = Martedì, 3 = Mercoledì, 4 = Giovedì, 5 = Venerdì, 6 = Sabato
  timeSlotsByDay: {
    // Lun-gio (1, 2, 3, 4): solo sera dalle 20:00 alle 23:30
    1: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Lunedì
    2: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Martedì
    3: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Mercoledì
    4: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Giovedì
    // Ven-dom (5, 6, 0): pranzo 13:30-15:30 e sera 20:00-23:30
    5: ['13:30', '14:00', '14:30', '15:00', '15:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Venerdì
    6: ['13:30', '14:00', '14:30', '15:00', '15:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'], // Sabato
    0: ['13:30', '14:00', '14:30', '15:00', '15:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']  // Domenica
  },
  
  // Orari legacy per compatibilità (mantenuto per retrocompatibilità)
  timeSlots: [
    '13:30', '14:00', '14:30', '15:00', '15:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ],
  
  // Giorni in cui il locale è chiuso (0 = Domenica, 1 = Lunedì, 2 = Martedì, ecc.)
  closedDays: [] // Nessun giorno chiuso - tutti i giorni sono aperti
};
