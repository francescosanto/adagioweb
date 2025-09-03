# Configurazione Google Sheets per Prenotazioni

## Prerequisiti
- Account Google Cloud Platform
- Progetto Google Cloud con Google Sheets API abilitata
- Service Account creato e configurato
- File delle credenziali JSON scaricato

## Passi per la Configurazione

### 1. Configurazione Google Cloud Platform

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona quello esistente
3. Abilita Google Sheets API:
   - Vai su "APIs & Services" > "Library"
   - Cerca "Google Sheets API"
   - Clicca su "Enable"

### 2. Creazione Service Account

1. Vai su "APIs & Services" > "Credentials"
2. Clicca su "Create Credentials" > "Service Account"
3. Compila i campi:
   - Name: `adagio-bookings-service`
   - Description: `Service account per gestione prenotazioni ristorante`
4. Clicca su "Create and Continue"
5. Assegna il ruolo "Editor" per Google Sheets
6. Clicca su "Done"

### 3. Generazione Chiave Privata

1. Clicca sul service account appena creato
2. Vai su "Keys" tab
3. Clicca "Add Key" > "Create new key"
4. Seleziona "JSON"
5. Scarica il file JSON
6. **IMPORTANTE**: Rinomina il file in `service-account-key.json`
7. Sposta il file nella root del progetto (stessa cartella di `package.json`)

### 4. Configurazione Google Sheets

1. Vai su [Google Sheets](https://sheets.google.com)
2. Crea un nuovo foglio o usa quello esistente
3. Crea le seguenti colonne nell'ordine esatto:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Data | Ora | Nome | Telefono | Email | Numero Persone | Note | Stato | Timestamp |

4. **IMPORTANTE**: La prima riga deve essere l'intestazione
5. Condividi il foglio con l'email del service account (es: `adagio-bookings-service@project-id.iam.gserviceaccount.com`)
6. Assegna i permessi di "Editor"

### 5. Ottenere l'ID del Foglio

1. Apri il foglio Google Sheets
2. L'URL sarà simile a: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
3. L'ID è la parte tra `/d/` e `/edit`: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 6. Configurazione Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
REACT_APP_GOOGLE_SHEET_ID=IL_TUO_ID_FOGLIO_QUI
REACT_APP_GOOGLE_SHEET_NAME=Sheet1
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=adagio-bookings-service@project-id.iam.gserviceaccount.com
REACT_APP_SYNC_INTERVAL=300000
REACT_APP_MAX_CAPACITY=50
```

**Sostituisci:**
- `IL_TUO_ID_FOGLIO_QUI` con l'ID del foglio ottenuto al passo 5
- `Sheet1` con il nome del tuo foglio (se diverso)
- `adagio-bookings-service@project-id.iam.gserviceaccount.com` con l'email del tuo service account

### 7. Struttura del Foglio

Il sistema si aspetta questa struttura:

- **Colonna A (Data)**: Formato DD/MM/YYYY (es: 15/12/2024)
- **Colonna B (Ora)**: Formato HH:MM (es: 19:30)
- **Colonna C (Nome)**: Nome e cognome del cliente
- **Colonna D (Telefono)**: Numero di telefono
- **Colonna E (Email)**: Email del cliente (opzionale)
- **Colonna F (Numero Persone)**: Numero di ospiti
- **Colonna G (Note)**: Richieste speciali, allergie, ecc.
- **Colonna H (Stato)**: Pendente/Confermato/Cancellato
- **Colonna I (Timestamp)**: Data e ora della prenotazione

### 8. Test della Configurazione

1. Riavvia l'applicazione React
2. Vai alla sezione Prenotazioni
3. Dovresti vedere "Connesso a Google Sheets" in verde
4. Il calendario dovrebbe mostrare il mese corrente
5. Prova a selezionare una data e un orario

### 9. Risoluzione Problemi

#### Errore "Nessuna connessione a Google Sheets"
- Verifica che il file `service-account-key.json` sia nella root del progetto
- Controlla che l'ID del foglio sia corretto
- Verifica che il service account abbia accesso al foglio

#### Errore "Google Sheets API non abilitata"
- Vai su Google Cloud Console
- Abilita Google Sheets API per il progetto

#### Errore "Permessi insufficienti"
- Condividi il foglio con l'email del service account
- Assegna i permessi di "Editor"

### 10. Personalizzazione

#### Cambiare l'intervallo di sincronizzazione
Modifica `REACT_APP_SYNC_INTERVAL` nel file `.env`:
- `300000` = 5 minuti
- `600000` = 10 minuti
- `1800000` = 30 minuti

#### Cambiare la capacità massima
Modifica `REACT_APP_MAX_CAPACITY` nel file `.env`:
- `50` = 50 persone contemporaneamente
- `100` = 100 persone contemporaneamente

#### Cambiare gli orari disponibili
Modifica il file `src/config/config.js` nella sezione `timeSlots`.

## Sicurezza

- **NON condividere** il file `service-account-key.json`
- **NON committare** il file delle credenziali su Git
- Aggiungi `service-account-key.json` al `.gitignore`
- Usa variabili d'ambiente per le configurazioni sensibili

## Supporto

Se hai problemi:
1. Controlla la console del browser per errori
2. Verifica che tutte le credenziali siano corrette
3. Controlla i permessi del service account
4. Verifica che Google Sheets API sia abilitata
