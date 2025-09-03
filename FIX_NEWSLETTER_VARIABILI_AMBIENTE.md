# 🔧 Fix Newsletter - Variabili d'Ambiente

## 🚨 Problema Identificato

Il sistema newsletter non funzionava perché il backend stava cercando le variabili d'ambiente con il prefisso `REACT_APP_`, che sono specifiche del frontend React, non del backend Node.js.

## ✅ Soluzioni Implementate

### 1. **Correzione Variabili d'Ambiente**
- **Prima**: `process.env.REACT_APP_NEWSLETTER_SHEET_ID`
- **Dopo**: `process.env.NEWSLETTER_SHEET_ID`

### 2. **File Modificati**
- `services/newsletterService.js` - Corrette tutte le variabili d'ambiente
- `services/bookingService.js` - Aggiunto logging dettagliato per debug
- `controllers/newsletterController.js` - Aggiunto endpoint debug
- `routes/newsletterRoutes.js` - Aggiunta route debug
- `env.example` - Aggiornato con le nuove variabili

### 3. **Nuovi Endpoint di Debug**
- `GET /api/newsletter/debug-env` - Mostra lo stato delle variabili d'ambiente
- `GET /api/newsletter/test-connection` - Testa la connessione al foglio

## 🔧 Configurazione Richiesta

### Nel tuo file `.env` (backend), aggiungi:

```env
# Newsletter Configuration (Backend)
NEWSLETTER_SHEET_ID=*** (il tuo ID del foglio newsletter)
NEWSLETTER_SHEET_NAME=*** (il nome del foglio, es. "Newsletter")
```

### Mantieni anche le variabili frontend:

```env
# Newsletter Configuration (Frontend)
REACT_APP_NEWSLETTER_SHEET_ID=*** (stesso ID)
REACT_APP_NEWSLETTER_SHEET_NAME=*** (stesso nome)
```

## 🧪 Test da Eseguire

### 1. **Test Variabili d'Ambiente**
```bash
curl http://localhost:5001/api/newsletter/debug-env
```

### 2. **Test Connessione Newsletter**
```bash
curl http://localhost:5001/api/newsletter/test-connection
```

### 3. **Test Prenotazione con Email**
Fai una prenotazione con un'email e controlla i log del server per vedere se l'email viene aggiunta alla newsletter.

## 📋 Log da Controllare

Quando fai una prenotazione con email, dovresti vedere nei log:

```
Tentativo di aggiunta email test@example.com alla newsletter...
Variabili ambiente newsletter: {
  NEWSLETTER_SHEET_ID: 'Presente',
  NEWSLETTER_SHEET_NAME: 'Newsletter'
}
✅ Email test@example.com aggiunta automaticamente alla newsletter dalla prenotazione
```

## 🚀 Deploy

Dopo aver aggiunto le variabili d'ambiente:

1. **Locale**: Riavvia il server backend
2. **Render**: Aggiungi le variabili `NEWSLETTER_SHEET_ID` e `NEWSLETTER_SHEET_NAME` nelle impostazioni del servizio

## ⚠️ Note Importanti

- Le variabili `REACT_APP_*` sono per il frontend
- Le variabili senza prefisso sono per il backend
- Entrambe devono puntare allo stesso foglio Google Sheets
- Il sistema non blocca le prenotazioni se la newsletter fallisce
