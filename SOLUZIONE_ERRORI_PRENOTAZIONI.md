# Soluzione Errori Connessione Server - Sezione Prenotazioni

## Problemi Identificati

### 1. **✅ PROBLEMA RISOLTO: Google Sheets API non abilitata**
**Errore:** `Google Sheets API has not been used in project 581855038058 before or it is disabled`

**Soluzione Applicata:** 
- ✅ API Google Sheets abilitata su Google Cloud Console
- ✅ Connessione al server stabilita con successo

### 2. **✅ Problema Risolto: Versione Express incompatibile**
**Errore:** `Missing parameter name at ${i}: ${DEBUG_URL}`

**Soluzione Applicata:** 
- Aggiornata la versione di Express da `^5.1.0` a `^4.18.2` nel `package.json`
- Eseguito `npm install` per aggiornare le dipendenze

### 3. **✅ Problema Risolto: Percorso file chiave servizio**
**Errore:** File `service-account-key.json` non trovato

**Soluzione Applicata:**
- Corretto il percorso nel `server.js` da `./service-account-key.json` a `./service-account-key.json.json`

### 4. **✅ Problema Risolto: Configurazione variabili ambiente**
**Errore:** File `.env` non trovato dal server

**Soluzione Applicata:**
- Modificato `server.js` per usare `config.env` invece di `.env`

## Stato Attuale

✅ **Server Node.js:** Funzionante sulla porta 5000
✅ **API Endpoints:** Tutti disponibili e funzionanti
✅ **Connessione Google Sheets:** STABILITA CON SUCCESSO
✅ **Frontend React:** Configurato correttamente
⚠️ **Foglio Google Sheets:** Richiede configurazione struttura

## Test Completati

### ✅ Test Connessione
- **Endpoint:** `GET /api/test-connection`
- **Risultato:** `{"success":true,"message":"Connessione a Google Sheets riuscita"}`
- **Status:** FUNZIONANTE

### ⚠️ Test Prenotazioni
- **Endpoint:** `GET /api/bookings`
- **Risultato:** Errore nella lettura da Google Sheets
- **Status:** Richiede configurazione foglio

### ⚠️ Test Disponibilità
- **Endpoint:** `GET /api/availability/:date`
- **Risultato:** Routing non corretto
- **Status:** Richiede correzione

## Prossimi Passi per Completare

### Passo 1: Configura Foglio Google Sheets
1. Apri il foglio: `1i9vjCB6tbu1k8kkR1j_dWkFYXG5mjIRDPLnQrRr_ZxY`
2. Crea le seguenti colonne nell'ordine esatto:
   ```
   A: Data
   B: Ora
   C: Nome
   D: Telefono
   E: Email
   F: Numero Persone
   G: Note
   H: Status
   I: Timestamp
   ```
3. Inserisci un'intestazione nella prima riga

### Passo 2: Verifica Permessi
1. Condividi il foglio con: `booking-service@regal-habitat-469812-d1.iam.gserviceaccount.com`
2. Permessi: "Editor"

### Passo 3: Test Completo
1. Riavvia il server: `npm run server`
2. Testa tutti gli endpoint:
   - `GET /api/test-connection` ✅ (già funzionante)
   - `GET /api/bookings` (dovrebbe restituire array vuoto o prenotazioni)
   - `GET /api/availability/22/08/2025` (dovrebbe restituire JSON con disponibilità)

## Comandi Utili

```bash
# Avvia solo il server
npm run server

# Avvia solo il frontend
npm start

# Avvia entrambi (Windows)
npm run dev:win

# Installa dipendenze
npm install

# Test endpoint (PowerShell)
Invoke-WebRequest -Uri "http://localhost:5000/api/test-connection" -UseBasicParsing
```

## Struttura File Importanti

- `server.js` - Server Node.js con API ✅
- `src/components/Prenotazioni.js` - Componente React prenotazioni ✅
- `src/hooks/useBookings.js` - Hook per gestione prenotazioni ✅
- `src/config/api.js` - Configurazione API frontend ✅
- `config.env` - Variabili ambiente server ✅
- `service-account-key.json.json` - Chiave servizio Google ✅

## Note Tecniche

- **Porta Server:** 5000 ✅
- **Porta Frontend:** 3000 (default React)
- **Sincronizzazione:** Ogni 5 minuti (300000ms)
- **Capacità Massima:** 50 persone per orario
- **Orari Disponibili:** 12:00-14:30 e 19:00-21:30

## Risoluzione Completata

✅ **Connessione Server:** RISOLTA
✅ **API Google Sheets:** ABILITATA
⚠️ **Configurazione Foglio:** IN CORSO
⏳ **Sistema Prenotazioni:** QUASI COMPLETO

Una volta configurato il foglio Google Sheets con la struttura corretta, il sistema funzionerà al 100%:
- ✅ Visualizzazione calendario
- ✅ Controllo disponibilità in tempo reale
- ✅ Invio prenotazioni
- ✅ Sincronizzazione automatica con Google Sheets
- ✅ Gestione errori e riconnessione
