# 🔧 Problema Google APIs nel Full-Stack

## ❌ **Problema Identificato**

Quando avvii il full-stack con `npm run fullstack`, le API di Google Sheets e Google Places non funzionano correttamente.

### **Cause Possibili:**

1. **Percorso del Backend**: Lo script non naviga correttamente nella cartella `backend/`
2. **Variabili d'Ambiente**: Il file `.env` non viene caricato correttamente
3. **File di Configurazione**: Il `service-account-key.json` non viene trovato
4. **Timing**: Il backend non ha tempo sufficiente per avviarsi

## ✅ **Soluzioni**

### **Soluzione 1: Script Migliorato (Raccomandato)**

```bash
# Usa lo script migliorato
npm run fullstack:improved
```

**Vantaggi:**
- ✅ Gestione corretta dei percorsi
- ✅ Verifica dell'avvio del backend
- ✅ Test automatico delle API
- ✅ Logging dettagliato

### **Soluzione 2: Avvio Manuale**

```bash
# Terminale 1 - Backend
cd backend
node server.js

# Terminale 2 - Frontend
npm start
```

### **Soluzione 3: Test API Separato**

```bash
# Testa se le API funzionano
npm run test:apis
```

## 🔍 **Diagnostica**

### **1. Verifica Backend Attivo**
```bash
curl http://localhost:5001/api/health
# Risposta attesa: {"status":"OK","message":"Server Adagio funzionante"}
```

### **2. Verifica Google Sheets**
```bash
curl http://localhost:5001/api/bookings
# Risposta attesa: Array di prenotazioni
```

### **3. Verifica Google Places**
```bash
curl http://localhost:5001/api/reviews
# Risposta attesa: Recensioni Google
```

## 🛠️ **Risoluzione Problemi**

### **Errore: "Google Sheets API non configurata"**

**Causa**: File `.env` non caricato o variabili mancanti

**Soluzione**:
1. Verifica che `backend/.env` esista
2. Controlla che contenga:
   ```env
   GOOGLE_SHEET_ID=your_sheet_id
   GOOGLE_SHEET_NAME=Sheet1
   ```

### **Errore: "Service account key non trovato"**

**Causa**: File `service-account-key.json` mancante

**Soluzione**:
1. Verifica che `service-account-key.json` sia nella root del progetto
2. Controlla i permessi del file

### **Errore: "Google Places API key non configurata"**

**Causa**: API key mancante o non valida

**Soluzione**:
1. Verifica che `backend/.env` contenga:
   ```env
   GOOGLE_PLACES_API_KEY=your_api_key
   REACT_APP_GOOGLE_PLACES_API_KEY=your_api_key
   ```

## 📊 **Script Disponibili**

### **Avvio Servizi**
```bash
npm run fullstack:improved  # Script migliorato (raccomandato)
npm run fullstack          # Script originale
npm run backend            # Solo backend
npm start                 # Solo frontend
```

### **Test e Diagnostica**
```bash
npm run test:apis         # Test tutte le API
npm run stop             # Ferma tutti i servizi
```

## 🎯 **Flusso Corretto**

1. **Backend si avvia** → Carica variabili d'ambiente
2. **Connessione Google Sheets** → Testa connessione
3. **Connessione Google Places** → Testa API key
4. **Frontend si avvia** → Fa proxy al backend
5. **API funzionanti** → Tutto operativo

## 💡 **Suggerimenti**

- **Sviluppo**: Usa sempre `npm run fullstack:improved`
- **Debug**: Usa `npm run test:apis` per verificare le API
- **Produzione**: Il backend serve tutto (API + frontend)
- **Logs**: Controlla sempre i log del backend per errori

## 🚀 **Verifica Finale**

Dopo aver avviato il full-stack:

1. **Frontend**: `http://localhost:3000` (immagini caricate)
2. **Backend**: `http://localhost:5001` (API funzionanti)
3. **Health Check**: `http://localhost:5001/api/health`
4. **Bookings**: `http://localhost:5001/api/bookings`
5. **Reviews**: `http://localhost:5001/api/reviews`

Se tutto funziona, vedrai:
- ✅ Immagini caricate nel frontend
- ✅ Nessun errore proxy nella console
- ✅ API che rispondono correttamente
- ✅ Connessione a Google Sheets e Places

Il problema è **risolvibile** con lo script migliorato! 🎉
