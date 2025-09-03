# 🔧 Fix Newsletter - Istruzioni Complete

## 🚨 Problemi Risolti

### 1. **Validazione Newsletter Troppo Restrittiva**
- **Prima**: Il campo `language` doveva essere esattamente 'it', 'en', o 'es'
- **Dopo**: Il campo `language` è opzionale e accetta qualsiasi valore fino a 10 caratteri

### 2. **Variabili d'Ambiente Inconsistenti**
- **Prima**: Il backend usava `REACT_APP_NEWSLETTER_SHEET_ID` (variabile frontend)
- **Dopo**: Il backend usa `NEWSLETTER_SHEET_ID` con fallback a `REACT_APP_NEWSLETTER_SHEET_ID`

### 3. **Integrazione Newsletter nelle Prenotazioni**
- **Prima**: L'email non veniva aggiunta automaticamente alla newsletter
- **Dopo**: L'email viene aggiunta automaticamente quando si conferma una prenotazione

## ✅ Modifiche Implementate

### File Modificati:
1. `backend/services/newsletterService.js` - Corrette variabili d'ambiente
2. `services/newsletterService.js` - Corrette variabili d'ambiente
3. `middleware/validation.js` - Validazione meno restrittiva
4. `backend/middleware/validation.js` - Validazione meno restrittiva
5. `backend/controllers/newsletterController.js` - Aggiunto endpoint debug
6. `controllers/newsletterController.js` - Aggiunto endpoint debug
7. `backend/routes/newsletterRoutes.js` - Aggiunte route debug
8. `routes/newsletterRoutes.js` - Aggiunte route debug
9. `env.example` - Aggiornato con variabili corrette

### Nuovi Endpoint:
- `GET /api/newsletter/debug-env` - Mostra lo stato delle variabili d'ambiente
- `GET /api/newsletter/test-connection` - Testa la connessione al Google Sheet

## 🔧 Configurazione Richiesta

### 1. **Variabili d'Ambiente Backend**
Nel tuo file `.env` (nella cartella backend), aggiungi:

```env
# Newsletter Configuration (Backend)
NEWSLETTER_SHEET_ID=il_tuo_id_del_foglio_newsletter
NEWSLETTER_SHEET_NAME=Newsletter

# Mantieni anche le variabili frontend
REACT_APP_NEWSLETTER_SHEET_ID=il_tuo_id_del_foglio_newsletter
REACT_APP_NEWSLETTER_SHEET_NAME=Newsletter
```

### 2. **Variabili d'Ambiente Frontend**
Nel tuo file `.env` (nella root del progetto), mantieni:

```env
# Newsletter Configuration (Frontend)
REACT_APP_NEWSLETTER_SHEET_ID=il_tuo_id_del_foglio_newsletter
REACT_APP_NEWSLETTER_SHEET_NAME=Newsletter
```

## 🧪 Test da Eseguire

### 1. **Test Automatico**
```bash
node test-newsletter-fix.js
```

### 2. **Test Manuali**

#### Test Variabili d'Ambiente:
```bash
curl http://localhost:5001/api/newsletter/debug-env
```

#### Test Connessione:
```bash
curl http://localhost:5001/api/newsletter/test-connection
```

#### Test Iscrizione Newsletter:
```bash
curl -X POST http://localhost:5001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"Test","language":"it"}'
```

#### Test Prenotazione con Email:
```bash
curl -X POST http://localhost:5001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "date":"25-12-2024",
    "time":"20:00",
    "name":"Test User",
    "phone":"+39 123 456 7890",
    "email":"test@example.com",
    "guests":2,
    "notes":"Test prenotazione"
  }'
```

## 📋 Log da Controllare

Quando fai una prenotazione con email, dovresti vedere nei log del server:

```
Tentativo di aggiunta email test@example.com alla newsletter...
Variabili ambiente newsletter: {
  NEWSLETTER_SHEET_ID: 'Presente',
  NEWSLETTER_SHEET_NAME: 'Newsletter'
}
✅ Email test@example.com aggiunta automaticamente alla newsletter dalla prenotazione
```

## 🚀 Deploy

### Locale:
1. Riavvia il server backend
2. Testa con il file `test-newsletter-fix.js`

### Render:
1. Aggiungi le variabili `NEWSLETTER_SHEET_ID` e `NEWSLETTER_SHEET_NAME` nelle impostazioni del servizio
2. Riavvia il servizio

## ⚠️ Note Importanti

- Le variabili `REACT_APP_*` sono per il frontend React
- Le variabili senza prefisso sono per il backend Node.js
- Entrambe devono puntare allo stesso foglio Google Sheets
- Il sistema non blocca le prenotazioni se l'aggiunta alla newsletter fallisce
- La validazione è ora più permissiva per il campo `language`

## 🔍 Risoluzione Problemi

### Se l'iscrizione newsletter non funziona:
1. Controlla le variabili d'ambiente con `/api/newsletter/debug-env`
2. Testa la connessione con `/api/newsletter/test-connection`
3. Verifica che il Google Sheet esista e sia accessibile
4. Controlla i log del server per errori dettagliati

### Se l'email non viene aggiunta dalle prenotazioni:
1. Controlla che l'email sia fornita nella prenotazione
2. Verifica i log del server per messaggi di debug
3. Assicurati che le variabili d'ambiente siano configurate correttamente
