const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('🔧 Caricamento dipendenze...');

// Import delle route API
let bookingRoutes, reviewRoutes, newsletterRoutes, availabilityRoutes;

try {
  bookingRoutes = require('./routes/bookingRoutes');
  console.log('✅ bookingRoutes caricato');
} catch (error) {
  console.error('❌ Errore caricamento bookingRoutes:', error.message);
  throw error;
}

try {
  reviewRoutes = require('./routes/reviewRoutes');
  console.log('✅ reviewRoutes caricato');
} catch (error) {
  console.error('❌ Errore caricamento reviewRoutes:', error.message);
  throw error;
}

try {
  newsletterRoutes = require('./routes/newsletterRoutes');
  console.log('✅ newsletterRoutes caricato');
} catch (error) {
  console.error('❌ Errore caricamento newsletterRoutes:', error.message);
  throw error;
}

try {
  availabilityRoutes = require('./routes/availabilityRoutes');
  console.log('✅ availabilityRoutes caricato');
} catch (error) {
  console.error('❌ Errore caricamento availabilityRoutes:', error.message);
  throw error;
}

console.log('✅ Tutte le dipendenze caricate correttamente');

const app = express();

// Trust proxy per servizi cloud (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware di logging semplice
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Configurazione CORS per sviluppo e produzione
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔧 DEBUG CORS - Origin ricevuto:', origin);
    console.log('🔧 DEBUG CORS - NODE_ENV:', process.env.NODE_ENV);
    
    // In sviluppo, accetta tutte le origini
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('✅ DEBUG CORS - Modalità sviluppo, accetto tutte le origini');
      return callback(null, true);
    }
    
    // In produzione, accetta solo domini specifici
    const allowedOrigins = [
      'https://adagiosevilla.github.io',
      'https://adagio-restaurant.netlify.app',
      'https://adagio-restaurant.vercel.app',
      'https://adagio-restaurant.onrender.com',
      'https://adagioweb.onrender.com',
      'https://www.adagiosevilla.com', // Il tuo dominio attuale
      'https://adagiosevilla.com' // Senza www
    ];
    
    console.log('🔧 DEBUG CORS - Origini consentite:', allowedOrigins);
    
    // Se non c'è origin (richieste da server, Postman, etc.) o è nella lista, accetta
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ DEBUG CORS - Origin consentito:', origin);
      callback(null, true);
    } else {
      console.log('❌ DEBUG CORS - Origin NON consentito:', origin);
      callback(new Error('Non consentito da CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware principali
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server Adagio funzionante',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5001
  });
});

// API Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/availability', availabilityRoutes);

// Endpoint diretti per compatibilità con il frontend
app.get('/api/test-place-id', require('./controllers/reviewController').testPlaceId);
app.get('/api/search-place-id', require('./controllers/reviewController').searchPlaceId);
app.get('/api/google-reviews', require('./controllers/reviewController').getGoogleReviews);
app.get('/api/test-connection', require('./controllers/bookingController').testConnection);

// 404 handler per API non trovate (DEVE essere prima della route *)
app.use('/api/*', (req, res) => {
  console.log(`🚨 API non trovata: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false,
    error: 'Endpoint API non trovato',
    path: req.path,
    method: req.method
  });
});

// Serve static files from React build (se presente)
app.use(express.static(path.join(__dirname, 'build')));

// Serve React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), (err) => {
    if (err) {
      // Se il file build non esiste, restituisci un messaggio di benvenuto
      res.status(404).json({
        success: true,
        message: 'API Server Adagio - Frontend non ancora deployato',
        endpoints: {
          health: '/api/health',
          bookings: '/api/bookings',
          reviews: '/api/reviews',
          newsletter: '/api/newsletter',
          availability: '/api/availability'
        }
      });
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Errore del server:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Non esporre dettagli dell'errore in produzione
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({ 
    success: false,
    error: 'Errore interno del server',
    message: isDevelopment ? err.message : 'Si è verificato un errore imprevisto',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Configurazione porta
const PORT = process.env.PORT || 5001;

// Avvio del server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server Adagio avviato sulla porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API disponibili:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/bookings`);
  console.log(`   POST /api/bookings`);
  console.log(`   GET  /api/availability/:date`);
  console.log(`   GET  /api/reviews`);
  console.log(`   POST /api/newsletter/subscribe`);
  console.log(`   GET  /api/newsletter/emails`);
  console.log(`🌐 Server disponibile su http://localhost:${PORT}`);
});

// Gestione errori di avvio
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;