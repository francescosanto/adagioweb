# 🚀 Nuova Configurazione Google per Cliente

## 📋 **Checklist Completa per Cambio Account**

### **1. Preparazione Nuovo Account Google Cloud**

- [ ] **Accedi** a [Google Cloud Console](https://console.cloud.google.com/) con il nuovo account
- [ ] **Crea nuovo progetto** o seleziona quello esistente
- [ ] **Abilita le API necessarie**:
  - [ ] Google Places API
  - [ ] Google Sheets API

### **2. Creazione Credenziali**

#### **A. API Key per Google Places:**
- [ ] Vai su "Credenziali" → "Crea Credenziali" → "Chiave API"
- [ ] **Copia la nuova API key** (inizia con "AIza...")
- [ ] **Configura restrizioni**:
  - [ ] Restrizioni applicazione: Solo per il tuo dominio
  - [ ] Restrizioni API: Solo Places API

#### **B. Service Account per Google Sheets:**
- [ ] Vai su "Credenziali" → "Crea Credenziali" → "Account di servizio"
- [ ] **Nome**: `adagio-bookings-service`
- [ ] **Descrizione**: `Service account per gestione prenotazioni ristorante`
- [ ] **Ruolo**: "Editor" per Google Sheets
- [ ] **Crea e scarica** il file JSON delle credenziali
- [ ] **Rinomina** il file in `service-account-key.json`

### **3. Configurazione Google Sheets**

- [ ] **Crea nuovo foglio Google Sheets** con il nuovo account
- [ ] **Struttura colonne** (nell'ordine esatto):
  ```
  A: Data | B: Ora | C: Nome | D: Telefono | E: Email | F: Numero Persone | G: Note | H: Stato | I: Timestamp
  ```
- [ ] **Condividi il foglio** con l'email del service account
- [ ] **Permessi**: "Editor"
- [ ] **Copia l'ID del foglio** dall'URL

### **4. Aggiornamento File Progetto**

#### **A. File `.env` (crea nella root):**
```env
# Configurazione per il nuovo account Google del cliente
REACT_APP_GOOGLE_PLACES_API_KEY=LA_TUA_NUOVA_API_KEY_QUI
REACT_APP_GOOGLE_SHEET_ID=IL_TUO_NUOVO_SHEET_ID_QUI
REACT_APP_GOOGLE_SHEET_NAME=Sheet1
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=il-tuo-nuovo-service-account@project.iam.gserviceaccount.com
REACT_APP_SYNC_INTERVAL=300000
REACT_APP_MAX_CAPACITY=50
```

#### **B. File credenziali:**
- [ ] **Sostituisci** `service-account-key.json` nella root del progetto
- [ ] **Verifica** che il file sia nella stessa cartella di `package.json`

### **5. Test della Configurazione**

- [ ] **Riavvia l'applicazione** (`npm start`)
- [ ] **Verifica Google Places**:
  - [ ] Vai alla sezione "Le Nostre Recensioni"
  - [ ] Controlla che le recensioni si carichino
  - [ ] Verifica la console per errori
- [ ] **Verifica Google Sheets**:
  - [ ] Vai alla sezione "Prenotazioni"
  - [ ] Dovresti vedere "Connesso a Google Sheets" in verde
  - [ ] Prova a selezionare una data e orario

### **6. Verifica Sicurezza**

- [ ] **Non committare** il file `.env` su Git
- [ ] **Non condividere** `service-account-key.json`
- [ ] **Verifica restrizioni** API key in Google Cloud Console
- [ ] **Monitora uso API** per evitare costi inaspettati

## 🔧 **Risoluzione Problemi Comuni**

### **Errore "API key non configurata"**
- Verifica che il file `.env` esista nella root
- Riavvia l'applicazione dopo aver aggiunto le variabili

### **Errore "Nessuna connessione a Google Sheets"**
- Verifica che `service-account-key.json` sia nella root
- Controlla che l'ID del foglio sia corretto
- Verifica che il service account abbia accesso al foglio

### **Errore "Quota exceeded"**
- Controlla l'uso delle API in Google Cloud Console
- Considera di aumentare i limiti di quota

## 📱 **Comandi per Testare**

```bash
# Riavvia l'applicazione
npm start

# Verifica che il server funzioni
npm run server

# Build per produzione
npm run build
```

## 🎯 **Prossimi Passi**

1. **Completa la checklist** sopra
2. **Testa tutte le funzionalità**:
   - Recensioni Google Places
   - Sistema prenotazioni Google Sheets
   - Calendario e disponibilità
3. **Verifica la sicurezza** delle credenziali
4. **Prepara per la consegna** al cliente

---

**⚠️ IMPORTANTE**: Mantieni sempre le credenziali sicure e non condividerle mai pubblicamente!
