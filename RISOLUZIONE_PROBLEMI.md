# 🔧 Risoluzione Problemi - Adagio

## ❌ **Problema: Immagini Non Caricate + Errori Proxy**

### **Sintomi:**
```
Proxy error: Could not proxy request /Piatti/... from localhost:3000 to http://localhost:5001/.
ECONNREFUSED
```

### **Causa:**
Il frontend React (porta 3000) cerca di fare proxy al backend (porta 5001), ma il backend non è attivo.

## ✅ **Soluzioni**

### **Soluzione 1: Avvio Full-Stack (Raccomandato)**

#### **Opzione A: Script Automatico**
```bash
# Avvia entrambi i servizi automaticamente
npm run fullstack
```

#### **Opzione B: Script Windows**
```bash
# Doppio click su:
start-full-stack.bat
```

#### **Opzione C: Manuale**
```bash
# Terminale 1 - Backend
cd backend
node server.js

# Terminale 2 - Frontend  
npm start
```

### **Soluzione 2: Solo Frontend (Senza Backend)**

Se vuoi solo testare il frontend senza le API:

1. **Rimuovi il proxy** dal `package.json`:
```json
{
  "proxy": "http://localhost:5001"  // ← Rimuovi questa riga
}
```

2. **Riavvia il frontend**:
```bash
npm start
```

### **Soluzione 3: Solo Backend (Senza Frontend)**

Se vuoi solo testare le API:

```bash
cd backend
node server.js
```

Poi vai su: `http://localhost:5001`

## 🚀 **Script Disponibili**

### **Avvio Servizi**
```bash
npm run fullstack    # Avvia frontend + backend
npm run backend      # Solo backend
npm start           # Solo frontend
```

### **Fermata Servizi**
```bash
npm run stop        # Ferma tutti i servizi
```

### **Script Windows**
```bash
start-full-stack.bat  # Avvia tutto
stop-all.bat         # Ferma tutto
```

## 🔍 **Verifica Funzionamento**

### **1. Controlla Backend**
```bash
curl http://localhost:5001/api/health
# Risposta attesa: {"status":"OK","message":"Server Adagio funzionante"}
```

### **2. Controlla Frontend**
```bash
# Vai su: http://localhost:3000
# Le immagini dovrebbero caricarsi correttamente
```

### **3. Controlla API**
```bash
curl http://localhost:5001/api/bookings
# Risposta attesa: Array di prenotazioni
```

## 🛠️ **Risoluzione Problemi Comuni**

### **Errore: Porta 5001 già in uso**
```bash
# Ferma tutti i processi Node.js
npm run stop

# Oppure manualmente:
taskkill /F /IM node.exe
```

### **Errore: Porta 3000 già in uso**
```bash
# Il frontend chiederà di usare una porta diversa
# Accetta premendo 'Y'
```

### **Immagini ancora non caricate**
1. Verifica che il backend sia attivo: `http://localhost:5001/api/health`
2. Controlla che i file siano nella cartella `public/`
3. Riavvia entrambi i servizi

### **API non funzionano**
1. Verifica le variabili d'ambiente in `backend/.env`
2. Controlla che `service-account-key.json` sia presente
3. Verifica la connessione a Google Sheets

## 📊 **Struttura Corretta**

```
Adagio/
├── public/           # File statici (immagini, video)
│   ├── Piatti/      # Immagini piatti
│   ├── Ambiente/    # Immagini ambiente
│   ├── Logo/        # Logo e immagini
│   └── Video/       # Video
├── backend/         # Server Express.js
│   ├── server.js    # Server principale
│   └── .env         # Variabili d'ambiente
├── src/             # Codice React
└── build/           # Build di produzione
```

## 🎯 **Flusso Corretto**

1. **Backend attivo** → Serve API e file statici
2. **Frontend attivo** → Fa proxy al backend per API
3. **Immagini** → Servite direttamente dal backend
4. **API** → Proxy dal frontend al backend

## 💡 **Suggerimenti**

- **Sviluppo**: Usa `npm run fullstack` per avviare tutto
- **Test API**: Usa solo il backend con `npm run backend`
- **Test UI**: Usa solo il frontend con `npm start`
- **Produzione**: Il backend serve tutto (API + frontend)

Il problema è **normale** e **risolvibile**! 🚀
