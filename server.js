const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import delle route API
const bookingRoutes = require('./backend/routes/bookingRoutes');
const reviewRoutes = require('./backend/routes/reviewRoutes');
const newsletterRoutes = require('./backend/routes/newsletterRoutes');
const availabilityRoutes = require('./backend/routes/availabilityRoutes');

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
    // In sviluppo, accetta tutte le origini
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return callback(null, true);
    }
    
    // In produzione, accetta solo domini specifici
    const allowedOrigins = [
      'https://adagiosevilla.github.io',
      'https://adagio-restaurant.netlify.app',
      'https://adagio-restaurant.vercel.app',
      'https://adagio-restaurant.onrender.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non consentito da CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
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

// 404 handler per API non trovate
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint API non trovato',
    path: req.path,
    method: req.method
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
app.listen(PORT, () => {
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

module.exports = app;