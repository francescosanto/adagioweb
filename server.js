const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: './.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Configurazione Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json', // File aggiornato per il nuovo account
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Configurazione Google Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'ChIJvfLE8RVrEg0RdJn5qwLZafk'; // Place ID di Adagio Sevilla

// Debug: stampa le variabili d'ambiente nel server
console.log('🔧 DEBUG SERVER - Variabili d\'ambiente:');
console.log('🔑 REACT_APP_GOOGLE_PLACES_API_KEY:', GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key presente:', !!GOOGLE_PLACES_API_KEY);
console.log('🔑 API Key lunghezza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.length : 0);
console.log('🔑 API Key inizia con AIza:', GOOGLE_PLACES_API_KEY ? GOOGLE_PLACES_API_KEY.startsWith('AIza') : false);
console.log('📍 PLACE_ID:', PLACE_ID);

// Funzione per testare se il Place ID è valido
const testPlaceId = async () => {
  try {
    console.log('🔍 Test Place ID esistente:', PLACE_ID);
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.warn('⚠️ Google Places API key non configurata');
      return null;
    }

    // Prima prova la nuova Places API (New)
    try {
      const basicInfoUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=displayName,formattedAddress,rating,userRatingCount&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('🌐 Test info base (nuova API):', basicInfoUrl);
      
      const response = await fetch(basicInfoUrl);
      const data = await response.json();
      console.log('📡 Risposta info base (nuova API):', data);
      
      if (response.ok && data) {
        const place = data;
        console.log('✅ Luogo trovato (nuova API):', {
          name: place.displayName?.text || 'N/A',
          address: place.formattedAddress || 'N/A',
          rating: place.rating || 'N/A',
          totalReviews: place.userRatingCount || 'N/A'
        });
        return place;
      }
    } catch (error) {
      console.log('⚠️ Nuova API fallita, provo la vecchia API...');
    }

    // Fallback alla vecchia API (ancora funzionante per alcuni progetti)
    try {
      const basicInfoUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,formatted_address,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('🌐 Test info base (vecchia API):', basicInfoUrl);
      
      const response = await fetch(basicInfoUrl);
      const data = await response.json();
      console.log('📡 Risposta info base (vecchia API):', data);
      
      if (data.status === 'OK' && data.result) {
        const place = data.result;
        console.log('✅ Luogo trovato (vecchia API):', {
          name: place.name,
          address: place.formatted_address,
          rating: place.rating,
          totalReviews: place.user_ratings_total
        });
        return place;
      } else {
        console.error('❌ Errore info base (vecchia API):', data.status, data.error_message);
      }
    } catch (error) {
      console.error('💥 Errore anche con la vecchia API:', error);
    }

    return null;
  } catch (error) {
    console.error('💥 Errore nel test del Place ID:', error);
    return null;
  }
};

// Funzione per cercare il Place ID corretto del ristorante
const searchRestaurantPlaceId = async (restaurantName, address) => {
  try {
    console.log('🔍 Ricerca Place ID per:', restaurantName, 'a', address);
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.warn('⚠️ Google Places API key non configurata');
      return null;
    }

    const searchQuery = `${restaurantName} ${address}`;
    // Usa l'API classica per la ricerca
    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    console.log('🌐 Chiamata ricerca API (classica):', apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('📡 Risposta ricerca API:', data);
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const place = data.results[0];
      console.log('✅ Luogo trovato (API classica):', {
        name: place.name,
        place_id: place.place_id,
        address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      });
      return place.place_id;
    } else {
      console.warn('⚠️ Nessun luogo trovato per la ricerca');
      return null;
    }
  } catch (error) {
    console.error('💥 Errore nella ricerca del Place ID:', error);
    return null;
  }
};

// Funzione per verificare la connessione a Google Sheets
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

// Endpoint per testare la connessione
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint per testare il Place ID esistente
app.get('/api/test-place-id', async (req, res) => {
  try {
    const result = await testPlaceId();
    if (result) {
      res.json({ success: true, place: result });
    } else {
      res.json({ success: false, message: 'Place ID non valido o errore API' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint per cercare un nuovo Place ID
app.get('/api/search-place-id', async (req, res) => {
  try {
    const { name, location } = req.query;
    if (!name || !location) {
      return res.status(400).json({ error: 'Parametri name e location richiesti' });
    }
    
    const placeId = await searchRestaurantPlaceId(name, location);
    if (placeId) {
      res.json({ success: true, placeId });
    } else {
      res.json({ success: false, message: 'Nessun luogo trovato' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint per ottenere le recensioni Google
app.get('/api/google-reviews', async (req, res) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key non configurata' });
    }

    // Usa la nuova Places API (New) per le recensioni
    const apiUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews,rating,userRatingCount&key=${GOOGLE_PLACES_API_KEY}`;
    console.log('🌐 Chiamata API recensioni (nuova):', apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('📡 Risposta API recensioni:', data);
    
    if (response.ok && data) {
      if (data.reviews && data.reviews.length > 0) {
        const reviews = data.reviews.map(review => {
          console.log('🔍 Debug recensione completa:', {
            keys: Object.keys(review),
            createTime: review.createTime,
            publishTime: review.publishTime,
            updateTime: review.updateTime,
            raw: review
          });
          
          // Prova diversi campi per la data
          let timestamp = review.createTime || review.publishTime || review.updateTime;
          
          return {
            id: review.name || Math.random(),
            author: review.authorAttribution?.displayName || 'Anonimo',
            rating: review.rating || 5,
            date: formatExactDate(timestamp),
            text: review.text?.text || 'Nessun testo',
            helpful: Math.floor(Math.random() * 20) + 5,
            profilePhoto: review.authorAttribution?.photoUri || null,
            source: 'google'
          };
        });
        
        res.json({ success: true, reviews, rating: data.rating, totalReviews: data.userRatingCount });
      } else {
        res.json({ success: false, message: 'Nessuna recensione trovata', rating: data.rating, totalReviews: data.userRatingCount });
      }
    } else {
      res.json({ success: false, message: 'Errore API', error: data.error?.message || 'Errore sconosciuto' });
    }
  } catch (error) {
    console.error('💥 Errore nel recupero delle recensioni:', error);
    res.status(500).json({ error: 'Errore nel recupero delle recensioni' });
  }
});

// Funzione per formattare la data esatta
const formatExactDate = (timestamp) => {
  console.log('🔍 formatExactDate ricevuto:', timestamp, 'tipo:', typeof timestamp);
  
  if (!timestamp) {
    console.log('❌ Nessun timestamp fornito');
    return 'Data non disponibile';
  }
  
  try {
    let date;
    
    // Gestisce diversi formati di timestamp
    if (typeof timestamp === 'string') {
      // Se è una stringa, prova a parsarla direttamente
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      // Se è un numero, potrebbe essere in secondi o millisecondi
      if (timestamp > 1000000000000) {
        // È in millisecondi
        date = new Date(timestamp);
      } else {
        // È in secondi, converti in millisecondi
        date = new Date(timestamp * 1000);
      }
    } else {
      console.log('❌ Formato timestamp non riconosciuto:', timestamp);
      return 'Data non disponibile';
    }
    
    // Verifica che la data sia valida
    if (isNaN(date.getTime())) {
      console.log('❌ Data non valida dopo il parsing:', date);
      return 'Data non disponibile';
    }
    
    console.log('✅ Data parsata correttamente:', date);
    
    // Formato italiano: "15 marzo 2024"
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    const formattedDate = date.toLocaleDateString('it-IT', options);
    console.log('✅ Data formattata:', formattedDate);
    
    return formattedDate;
  } catch (error) {
    console.error('❌ Errore nel parsing della data:', error, 'timestamp:', timestamp);
    return 'Data non disponibile';
  }
};

// Endpoint per leggere tutte le prenotazioni
app.get('/api/bookings', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.GOOGLE_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json([]);
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

    res.json(bookings);
  } catch (error) {
    console.error('Errore nella lettura delle prenotazioni:', error);
    res.status(500).json({ error: 'Impossibile leggere le prenotazioni da Google Sheets' });
  }
});

// Endpoint per aggiungere una nuova prenotazione
app.post('/api/bookings', async (req, res) => {
  try {
    const { date, time, name, phone, email, guests, notes } = req.body;

    // Validazione base
    if (!date || !time || !name || !phone || !guests) {
      return res.status(400).json({ error: 'Campi obbligatori mancanti' });
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

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Errore nell\'aggiunta della prenotazione:', error);
    res.status(500).json({ error: 'Impossibile aggiungere la prenotazione a Google Sheets' });
  }
});

// Endpoint per verificare la disponibilità
app.get('/api/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Orari disponibili
    const timeSlots = [
      '13:30', '14:00', '14:30', '15:00', '15:30',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
    ];

    const maxCapacity = parseInt(process.env.MAX_CAPACITY) || 50;
    const availability = {};

    // Per ora, rendi tutti gli slot sempre disponibili
    for (const time of timeSlots) {
      availability[time] = { 
        available: true, 
        capacity: maxCapacity, 
        reason: 'Libero - Sempre disponibile' 
      };
    }

    res.json(availability);
  } catch (error) {
    console.error('Errore nel controllo disponibilità:', error);
    res.status(500).json({ error: 'Impossibile verificare la disponibilità' });
  }
});

// Endpoint per ottenere statistiche
app.get('/api/stats', async (req, res) => {
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

    res.json(stats);
  } catch (error) {
    console.error('Errore nel recupero statistiche:', error);
    res.status(500).json({ error: 'Impossibile recuperare le statistiche' });
  }
});

// Endpoint per aggiungere email alla newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, source = 'Website', language = 'it' } = req.body;

    // Validazione email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email non valida' 
      });
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
        return res.json({ 
          success: false, 
          error: 'Email già registrata alla newsletter' 
        });
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

    res.json({ 
      success: true, 
      message: 'Email aggiunta alla newsletter con successo',
      data: response.data 
    });
  } catch (error) {
    console.error('Errore nell\'aggiunta email newsletter:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Impossibile aggiungere l\'email alla newsletter' 
    });
  }
});

// Endpoint per leggere tutte le email della newsletter
app.get('/api/newsletter/emails', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
      range: `${process.env.REACT_APP_NEWSLETTER_SHEET_NAME || 'Newsletter'}!A:D`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json([]);
    }

    // Rimuove l'intestazione e converte i dati
    const emails = rows.slice(1).map((row, index) => ({
      id: index + 1,
      email: row[0] || '',
      date: row[1] || '',
      source: row[2] || 'Website',
      language: row[3] || 'it',
    }));

    res.json(emails);
  } catch (error) {
    console.error('Errore nella lettura email newsletter:', error);
    res.status(500).json({ error: 'Impossibile leggere le email newsletter' });
  }
});

// Endpoint per testare la connessione al foglio newsletter
app.get('/api/newsletter/test-connection', async (req, res) => {
  try {
    await sheets.spreadsheets.get({
      spreadsheetId: process.env.REACT_APP_NEWSLETTER_SHEET_ID,
    });
    res.json({ 
      success: true, 
      message: 'Connessione al foglio newsletter riuscita' 
    });
  } catch (error) {
    console.error('Errore nella connessione al foglio newsletter:', error);
    res.json({ 
      success: false, 
      message: 'Errore nella connessione al foglio newsletter' 
    });
  }
});

// Serve l'app React per tutte le altre route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Gestione errori globale
app.use((error, req, res, next) => {
  console.error('Errore del server:', error);
  res.status(500).json({ error: 'Errore interno del server' });
});

const PORT = process.env.BACKEND_PORT|| 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
  console.log(`📊 API disponibili:`);
  console.log(`   GET  /api/test-connection`);
  console.log(`   GET  /api/test-place-id`);
  console.log(`   GET  /api/search-place-id`);
  console.log(`   GET  /api/google-reviews`);
  console.log(`   GET  /api/bookings`);
  console.log(`   POST /api/bookings`);
  console.log(`   GET  /api/availability/:date`);
  console.log(`   GET  /api/stats`);
  console.log(`   POST /api/newsletter/subscribe`);
  console.log(`   GET  /api/newsletter/emails`);
  console.log(`   GET  /api/newsletter/test-connection`);
  console.log(`🌐 Frontend disponibile su http://localhost:${PORT}`);
});
