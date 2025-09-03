# Configurazione Newsletter Google Sheets

## Panoramica
La funzionalità newsletter è ora collegata a un Google Sheet separato per raccogliere le email degli iscritti. Questo ti permette di gestire facilmente la tua lista di contatti per campagne email marketing.

## Configurazione Google Sheet

### 1. Creare un nuovo Google Sheet
1. Vai su [Google Sheets](https://sheets.google.com)
2. Crea un nuovo foglio chiamato "Newsletter Adagio" (o il nome che preferisci)
3. Crea le seguenti colonne nell'ordine esatto:

| A | B | C | D |
|---|---|---|---|
| Email | Data Iscrizione | Fonte | Lingua |

### 2. Impostare l'intestazione
La prima riga deve contenere le intestazioni:
- **Colonna A**: "Email"
- **Colonna B**: "Data Iscrizione" 
- **Colonna C**: "Fonte"
- **Colonna D**: "Lingua"

### 3. Condividere il foglio
1. Clicca su "Condividi" in alto a destra
2. Aggiungi l'email del service account (la stessa usata per le prenotazioni)
3. Assegna i permessi di "Editor"

### 4. Ottenere l'ID del foglio
1. L'URL del foglio sarà simile a: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
2. L'ID è la parte tra `/d/` e `/edit`: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Configurazione Variabili d'Ambiente

Aggiungi queste variabili al tuo file `.env`:

```env
# Newsletter Google Sheets Configuration
REACT_APP_NEWSLETTER_SHEET_ID=IL_TUO_ID_FOGLIO_NEWSLETTER_QUI
REACT_APP_NEWSLETTER_SHEET_NAME=Newsletter
```

**Sostituisci:**
- `IL_TUO_ID_FOGLIO_NEWSLETTER_QUI` con l'ID del foglio ottenuto al passo 4
- `Newsletter` con il nome del tuo foglio (se diverso)

## Struttura dei Dati

Ogni volta che qualcuno si iscrive alla newsletter, verrà aggiunta una riga con:

- **Email**: L'indirizzo email dell'utente
- **Data Iscrizione**: Timestamp dell'iscrizione (formato ISO)
- **Fonte**: Sempre "Website" per le iscrizioni dal sito
- **Lingua**: La lingua dell'interfaccia quando si è iscritto (it, en, es)

## Funzionalità Implementate

### ✅ Form Newsletter Funzionale
- Validazione email in tempo reale
- Messaggi di successo/errore
- Prevenzione duplicati
- Stato di caricamento

### ✅ API Endpoints
- `POST /api/newsletter/subscribe` - Iscrive un'email
- `GET /api/newsletter/emails` - Legge tutte le email
- `GET /api/newsletter/test-connection` - Testa la connessione

### ✅ Gestione Errori
- Controllo email duplicate
- Validazione formato email
- Gestione errori di connessione
- Messaggi utente-friendly

## Test della Configurazione

### 1. Test Connessione
```bash
curl http://localhost:5001/api/newsletter/test-connection
```

### 2. Test Iscrizione
```bash
curl -X POST http://localhost:5001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"Website","language":"it"}'
```

### 3. Test Lettura Email
```bash
curl http://localhost:5001/api/newsletter/emails
```

## Utilizzo Pratico

### Per Campagne Email
1. Esporta i dati dal Google Sheet
2. Usa la colonna "Email" per le tue campagne
3. Filtra per "Lingua" per campagne multilingue
4. Usa "Data Iscrizione" per segmentare per periodo

### Per Analisi
- Conta il numero totale di iscritti
- Analizza la crescita nel tempo
- Identifica le lingue più popolari
- Monitora le fonti di iscrizione

## Sicurezza e Privacy

- ✅ Le email sono validate prima del salvataggio
- ✅ Prevenzione duplicati automatica
- ✅ Nessun dato sensibile esposto
- ✅ Connessione sicura HTTPS
- ✅ Service account con permessi limitati

## Risoluzione Problemi

### Errore "Connessione al foglio newsletter fallita"
- Verifica che l'ID del foglio sia corretto
- Controlla che il service account abbia accesso al foglio
- Assicurati che Google Sheets API sia abilitata

### Errore "Email già registrata"
- Questo è normale, previene duplicati
- L'utente riceverà un messaggio informativo

### Errore "Email non valida"
- Verifica che l'email contenga "@"
- Controlla che non sia vuota

## Personalizzazione

### Modificare i Messaggi
I messaggi sono hardcoded in `src/components/Footer.js`. Puoi personalizzarli modificando le stringhe nella funzione `handleNewsletterSubmit`.

### Aggiungere Campi
Per aggiungere campi aggiuntivi (es. nome, preferenze):
1. Modifica la struttura del Google Sheet
2. Aggiorna l'endpoint API nel server
3. Modifica il form nel Footer
4. Aggiorna la configurazione

## Supporto

Se hai problemi:
1. Controlla la console del browser per errori
2. Verifica le variabili d'ambiente
3. Testa la connessione con l'endpoint di test
4. Controlla i permessi del service account
