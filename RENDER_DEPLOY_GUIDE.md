# 🚀 Guida Deploy su Render - Piano Gratuito

## ✅ **Il tuo progetto È COMPATIBILE con il piano gratuito di Render!**

### 📊 **Analisi Compatibilità**

**✅ FUNZIONA PERFETTAMENTE:**
- ✅ Architettura semplice (Express.js + React)
- ✅ Nessun database esterno (usa Google Sheets)
- ✅ Dipendenze leggere
- ✅ Risorse richieste: ~512MB RAM (sufficiente)

**⚠️ LIMITAZIONI da considerare:**
- ⚠️ **Sleep Mode**: Server si "addormenta" dopo 15 min di inattività
- ⚠️ **Cold Start**: Primo accesso dopo sleep richiede 30-60 secondi
- ⚠️ **Nessun SSH**: Non puoi accedere direttamente al server
- ⚠️ **Un solo processo**: Nessun scaling automatico

## 🎯 **Istruzioni Deploy**

### 1. **Preparazione Repository**
```bash
# Assicurati che tutti i file siano committati
git add .
git commit -m "Preparazione per deploy Render"
git push origin main
```

### 2. **Configurazione su Render**

#### **A. Crea Nuovo Web Service**
1. Vai su [render.com](https://render.com)
2. Clicca "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Seleziona il repository "Adagio"

#### **B. Configurazione Build**
- **Name**: `adagio-restaurant`
- **Environment**: `Node`
- **Plan**: `Free`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

#### **C. Variabili d'Ambiente**
Configura queste variabili su Render:

```env
NODE_ENV=production
PORT=10000
GOOGLE_SHEET_ID=il_tuo_sheet_id
GOOGLE_SHEET_NAME=Sheet1
GOOGLE_PLACES_API_KEY=la_tua_api_key
MAX_CAPACITY=50
REACT_APP_GOOGLE_PLACES_API_KEY=la_tua_api_key
REACT_APP_NEWSLETTER_SHEET_ID=il_tuo_newsletter_sheet_id
REACT_APP_NEWSLETTER_SHEET_NAME=Newsletter
```

### 3. **File Necessari**

#### **A. Service Account Key**
- Carica il file `service-account-key.json` nella root del progetto
- **IMPORTANTE**: Non committare mai questo file su GitHub!
- Usa le variabili d'ambiente per le credenziali

#### **B. Build del Frontend**
- Il comando `npm run build` creerà automaticamente la cartella `build/`
- Render servirà i file statici dal backend

### 4. **Deploy e Test**

#### **A. Deploy**
1. Clicca "Create Web Service"
2. Aspetta che il build completi (5-10 minuti)
3. Il tuo sito sarà disponibile su `https://adagio-restaurant.onrender.com`

#### **B. Test Funzionalità**
```bash
# Test Health Check
curl https://adagio-restaurant.onrender.com/api/health

# Test Prenotazioni
curl https://adagio-restaurant.onrender.com/api/bookings

# Test Frontend
# Apri https://adagio-restaurant.onrender.com nel browser
```

## 🔧 **Ottimizzazioni per Piano Gratuito**

### 1. **Gestione Sleep Mode**
```javascript
// Aggiungi questo endpoint per "svegliare" il server
app.get('/api/wake-up', (req, res) => {
  res.json({ 
    status: 'awake', 
    timestamp: new Date().toISOString() 
  });
});
```

### 2. **Health Check Migliorato**
```javascript
// Il tuo server.js già ha questo endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server Adagio funzionante',
    timestamp: new Date().toISOString()
  });
});
```

### 3. **Logging per Debug**
```javascript
// I log sono visibili su Render Dashboard
console.log('Server avviato su porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV);
```

## 📱 **Esperienza Utente**

### **Scenario Normale (Server Attivo)**
- ✅ Accesso immediato (< 2 secondi)
- ✅ Tutte le funzionalità disponibili
- ✅ Prenotazioni in tempo reale

### **Scenario Sleep Mode (Server Dormiente)**
- ⚠️ Primo accesso: 30-60 secondi di attesa
- ✅ Accessi successivi: immediati
- ✅ Tutte le funzionalità disponibili

## 🎯 **Raccomandazioni**

### **Per un Ristorante:**
1. **Piano Gratuito è SUFFICIENTE** per iniziare
2. **Sleep mode** non è un problema per un ristorante
3. **Costi**: $0/mese vs $7/mese per piano Starter

### **Quando Considerare l'Upgrade:**
- Se hai più di 100 prenotazioni al giorno
- Se i clienti si lamentano dei tempi di attesa
- Se vuoi un dominio personalizzato

## 🚀 **Deploy Immediato**

Il tuo progetto è **PRONTO** per il deploy su Render con piano gratuito!

**Vantaggi:**
- ✅ Costo: $0/mese
- ✅ SSL automatico
- ✅ Deploy automatico da GitHub
- ✅ Logs in tempo reale
- ✅ Health checks automatici

**Limiti accettabili:**
- ⚠️ Sleep mode (30-60s al primo accesso)
- ⚠️ Nessun SSH (usa i log di Render)

## 🎉 **Conclusione**

**SÌ, il tuo progetto può funzionare perfettamente con il piano gratuito di Render!**

Le limitazioni sono minime e accettabili per un ristorante. Puoi sempre fare l'upgrade in futuro se necessario.

**Prossimo passo**: Segui le istruzioni sopra per il deploy! 🚀
