# 🚀 Configurazione API per Recensioni Reali

Questa guida ti spiega come configurare le API per ottenere le recensioni reali del ristorante Adagio da Google Maps e TripAdvisor.

## 📍 Google Places API

### 1. Ottenere una API Key

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona quello esistente
3. Abilita l'API "Places API" dalla sezione "API e servizi"
4. Vai su "Credenziali" e crea una nuova chiave API
5. Copia la chiave API generata

### 2. Configurare l'API Key

Crea un file `.env` nella root del progetto con:

```env
REACT_APP_GOOGLE_PLACES_API_KEY=la_tua_api_key_qui
```

### 3. Place ID del Ristorante

Il Place ID di Adagio Sevilla è già configurato nel codice:
- **Place ID**: `ChIJN1t_tDeuEmsRUsoyG83frY4`
- **Indirizzo**: [Maps Link](https://maps.app.goo.gl/5RxYZ4LUQdYDRHuj9)

### 4. Limitazioni e Costi

- **Quota gratuita**: 1000 richieste al giorno
- **Costo**: $0.017 per 1000 richieste aggiuntive
- **Rate limit**: 100 richieste al secondo

## 🗺️ TripAdvisor API

### Opzione 1: API Ufficiale (a pagamento)

TripAdvisor offre un'API a pagamento per le recensioni:
- **Costo**: Richiedi preventivo
- **Documentazione**: [TripAdvisor API](https://developer-tripadvisor.com/)

### Opzione 2: Web Scraping (alternativa gratuita)

Per ora, il sistema utilizza recensioni simulate che possono essere facilmente aggiornate quando avrai accesso all'API.

### Configurazione API Key (se disponibile)

```env
REACT_APP_TRIPADVISOR_API_KEY=la_tua_tripadvisor_api_key_qui
```

## 🔧 Configurazione del Sistema

### 1. Installazione Dipendenze

Le dipendenze necessarie sono già installate:
- `axios` - per le chiamate HTTP
- `swiper` - per il carosello delle recensioni

### 2. Struttura dei File

```
src/
├── config/
│   ├── googlePlaces.js    # Servizio Google Places
│   └── tripAdvisor.js     # Servizio TripAdvisor
├── hooks/
│   └── useReviews.js      # Hook per gestire le recensioni
└── components/
    ├── Recensioni.js      # Componente principale
    └── ReviewsCarousel.js # Carosello delle recensioni
```

### 3. Funzionalità Implementate

- ✅ Caricamento automatico delle recensioni
- ✅ Carosello interattivo con Swiper
- ✅ Gestione degli errori e stati di caricamento
- ✅ Fallback con recensioni simulate
- ✅ Aggiornamento manuale delle recensioni
- ✅ Confronto rating tra piattaforme
- ✅ Link diretti per lasciare recensioni

## 🚀 Test del Sistema

### 1. Avvia l'Applicazione

```bash
npm start
```

### 2. Verifica le Recensioni

- Vai alla sezione "Le Nostre Recensioni"
- Verifica che il carosello funzioni correttamente
- Testa la navigazione tra Google Maps e TripAdvisor
- Prova il pulsante "Aggiorna Recensioni"

### 3. Debug

Se le API non funzionano:
1. Controlla la console del browser per errori
2. Verifica che le API key siano configurate correttamente
3. Controlla i limiti di quota delle API

## 🔒 Sicurezza

### Best Practices

1. **Non committare mai le API key** nel codice
2. **Usa variabili d'ambiente** per le chiavi sensibili
3. **Configura restrizioni IP** nelle API key di Google
4. **Monitora l'uso delle API** per evitare costi inaspettati

### Restrizioni API Key

In Google Cloud Console, configura le restrizioni per la tua API key:
- **Restrizioni applicazione**: Solo per il tuo dominio
- **Restrizioni API**: Solo Places API
- **Restrizioni IP**: Solo i tuoi server (opzionale)

## 📱 Personalizzazione

### Modificare il Design

Il carosello utilizza Tailwind CSS e può essere personalizzato modificando:
- Colori nel file `tailwind.config.js`
- Stili nel componente `ReviewsCarousel.js`
- Animazioni con Framer Motion

### Aggiungere Nuove Piattaforme

Per aggiungere nuove piattaforme (es. Facebook, Yelp):
1. Crea un nuovo servizio in `src/config/`
2. Aggiungi le funzioni nel hook `useReviews.js`
3. Aggiorna il componente `Recensioni.js`

## 🆘 Risoluzione Problemi

### Errori Comuni

1. **"API key non configurata"**
   - Verifica che il file `.env` esista
   - Riavvia l'applicazione dopo aver aggiunto le variabili

2. **"Quota exceeded"**
   - Controlla l'uso delle API in Google Cloud Console
   - Considera di aumentare i limiti di quota

3. **"CORS error"**
   - Le API di Google Places supportano CORS
   - Verifica che l'API key sia valida

### Supporto

Se hai problemi:
1. Controlla la documentazione ufficiale delle API
2. Verifica i log della console del browser
3. Controlla lo stato delle API in Google Cloud Console

## 🎯 Prossimi Passi

1. **Configura le API key** seguendo questa guida
2. **Testa il sistema** con le recensioni reali
3. **Personalizza il design** secondo le tue preferenze
4. **Monitora l'uso delle API** per ottimizzare i costi
5. **Considera l'aggiornamento** a recensioni in tempo reale

---

**Nota**: Questo sistema è progettato per funzionare sia con API reali che con dati simulati, garantendo un'esperienza utente fluida in ogni scenario.
