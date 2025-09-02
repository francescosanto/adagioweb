# 🍽️ Adagio Backend API

Backend Express.js per il sistema di prenotazioni del ristorante Adagio.

## 🚀 Avvio Rapido

### 1. Installazione Dipendenze
```bash
npm install
```

### 2. Configurazione Variabili d'Ambiente
Copia il file `env.example` in `.env` e configura le variabili:

```bash
cp env.example .env
```

### 3. Avvio del Server
```bash
# Sviluppo (con auto-reload)
npm run dev

# Produzione
npm start
```

Il server sarà disponibile su `http://localhost:5001`

## 📊 API Endpoints

### Prenotazioni
- `GET /api/bookings` - Ottiene tutte le prenotazioni
- `POST /api/bookings` - Crea una nuova prenotazione
- `GET /api/bookings/stats` - Statistiche prenotazioni

### Disponibilità
- `GET /api/availability/:date` - Verifica disponibilità per data
- `GET /api/availability/:date/:time` - Verifica orario specifico

### Recensioni
- `GET /api/reviews` - Recensioni Google Places
- `GET /api/reviews/test-place-id` - Testa Place ID
- `GET /api/reviews/search-place-id` - Cerca nuovo Place ID

### Newsletter
- `POST /api/newsletter/subscribe` - Iscrizione newsletter
- `GET /api/newsletter/emails` - Lista email iscritte
- `GET /api/newsletter/test-connection` - Test connessione

### Sistema
- `GET /api/health` - Health check

## 🏗️ Struttura del Progetto

```
backend/
├── config/          # Configurazioni (Google Sheets, Places API)
├── controllers/     # Logica di controllo delle richieste
├── routes/          # Definizione delle route
├── services/        # Logica business e integrazioni
├── middleware/      # Middleware personalizzati
├── utils/           # Utility e helper
├── server.js        # File principale del server
└── package.json     # Dipendenze e script
```

## 🔧 Configurazione

### Google Sheets
- Configura `GOOGLE_SHEET_ID` e `GOOGLE_SHEET_NAME`
- Assicurati che il file `service-account-key.json` sia presente nella root del progetto

### Google Places API
- Configura `GOOGLE_PLACES_API_KEY`
- Il `PLACE_ID` è hardcoded per Adagio Sevilla

### Newsletter
- Configura `REACT_APP_NEWSLETTER_SHEET_ID` e `REACT_APP_NEWSLETTER_SHEET_NAME`

## 🧪 Test

Per testare le API, puoi usare:

```bash
# Health check
curl http://localhost:5001/api/health

# Test connessione Google Sheets
curl http://localhost:5001/api/bookings

# Test recensioni
curl http://localhost:5001/api/reviews
```

## 📝 Note

- Il server serve anche i file statici del frontend React
- Tutte le route non-API vengono reindirizzate al frontend
- CORS è abilitato per tutte le origini
- Gestione errori centralizzata
