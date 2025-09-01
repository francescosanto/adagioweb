# 🚀 Sistema Prenotazioni Adagio - Backend + Frontend

## 📋 Panoramica

Questo sistema combina un **backend Express** con un **frontend React** per gestire le prenotazioni del ristorante Adagio, collegandosi a Google Sheets per la persistenza dei dati.

## 🏗️ Architettura

```
Frontend (React) ←→ Backend (Express) ←→ Google Sheets API
     Porta 3000           Porta 5000
```

## 🚀 Avvio Rapido

### **1. Configurazione Google Sheets**
- Segui le istruzioni in `GOOGLE_SHEETS_SETUP.md`
- Ottieni il file `service-account-key.json`
- Mettilo nella root del progetto

### **2. Configurazione Variabili d'Ambiente**
Crea un file `.env` nella root (o usa `config.env`):
```env
GOOGLE_SHEET_ID=IL_TUO_ID_FOGLIO
GOOGLE_SHEET_NAME=Sheet1
MAX_CAPACITY=50
PORT=5000
NODE_ENV=development
```

### **3. Avvio Sviluppo**
```bash
# Avvia backend + frontend contemporaneamente
npm run dev

# Oppure separatamente:
npm run server:dev    # Backend (porta 5000)
npm run start         # Frontend (porta 3000)
```

### **4. Avvio Produzione**
```bash
# Build del frontend
npm run build

# Avvia solo il backend (serve anche il frontend)
npm run server
```

## 📁 Struttura File

```
Adagio/
├── server.js                    # Server Express principale
├── config.env                   # Configurazione backend
├── service-account-key.json     # Credenziali Google (NON COMMITTARE!)
├── package.json                 # Dipendenze e script
├── src/                         # Frontend React
│   ├── components/
│   │   └── Prenotazioni.js     # Componente prenotazioni
│   ├── config/
│   │   ├── api.js              # Chiamate API al backend
│   │   └── config.js           # Configurazione frontend
│   └── hooks/
│       └── useBookings.js      # Hook per gestione prenotazioni
└── build/                       # Frontend buildato (generato)
```

## 🔌 API Endpoints

### **Test Connessione**
- `GET /api/test-connection` - Testa connessione Google Sheets

### **Prenotazioni**
- `GET /api/bookings` - Legge tutte le prenotazioni
- `POST /api/bookings` - Aggiunge nuova prenotazione

### **Disponibilità**
- `GET /api/availability/:date` - Verifica disponibilità per data

### **Statistiche**
- `GET /api/stats` - Statistiche prenotazioni

## 🛠️ Script Disponibili

```bash
npm run start          # Avvia solo frontend React
npm run server         # Avvia solo backend Express
npm run server:dev     # Avvia backend con nodemon (auto-restart)
npm run dev            # Avvia backend + frontend contemporaneamente
npm run build          # Build frontend per produzione
```

## 🔧 Configurazione

### **Backend (server.js)**
- Porta: `process.env.PORT` o 5000
- CORS abilitato per frontend
- Serve file statici da cartella `build`
- Gestione errori globale

### **Frontend (React)**
- Porta: 3000 (sviluppo)
- Chiama API su `http://localhost:5000/api`
- Sincronizzazione automatica ogni 5 minuti
- Gestione stato connessione

## 🚨 Risoluzione Problemi

### **Errore "Can't resolve 'googleapis'"**
- ✅ Risolto: ora usa il backend Express

### **Errore "Nessuna connessione al server"**
- Verifica che il backend sia avviato sulla porta 5000
- Controlla i log del server
- Verifica configurazione `.env`

### **Errore "Google Sheets API non abilitata"**
- Vai su Google Cloud Console
- Abilita Google Sheets API
- Verifica credenziali service account

### **Porta già in uso**
- Cambia porta nel file `.env`
- Oppure ferma altri servizi sulla porta 5000

## 🔒 Sicurezza

- ✅ Credenziali Google nel backend (non esposte al frontend)
- ✅ Validazione input lato server
- ✅ CORS configurato per frontend
- ✅ Gestione errori sicura

## 📊 Monitoraggio

Il server logga:
- Avvio e configurazione
- Chiamate API
- Errori e connessioni
- Statistiche utilizzo

## 🚀 Deploy Produzione

1. **Build frontend**: `npm run build`
2. **Configura variabili d'ambiente**
3. **Avvia server**: `npm run server`
4. **Configura proxy/nginx se necessario**

## 📞 Supporto

Per problemi:
1. Controlla log del server
2. Verifica configurazione `.env`
3. Testa endpoint API separatamente
4. Controlla credenziali Google

---

**🎯 Sistema pronto per produzione con architettura professionale!**
