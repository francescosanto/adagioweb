const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Debug: Verifica variabili d'ambiente
console.log('🔧 DEBUG SERVER - Variabili d\'ambiente:');
console.log('🔑 GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Presente' : 'MANCANTE');
console.log('🔑 GOOGLE_PLACES_API_KEY:', process.env.GOOGLE_PLACES_API_KEY ? 'Presente' : 'MANCANTE');
console.log('🔑 BACKEND_PORT:', process.env.BACKEND_PORT || 'Default (5001)');
console.log('🔑 NODE_ENV:', process.env.NODE_ENV || 'development');

// Import routes
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

const app = express();

// Trust proxy per servizi cloud (Heroku, Render, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://maps.googleapis.com", "https://places.googleapis.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // limite di 100 richieste per IP ogni 15 minuti
  message: {
    success: false,
    error: 'Troppe richieste, riprova più tardi'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting più severo per endpoint pubblici
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // limite di 10 richieste per IP ogni 15 minuti
  message: {
    success: false,
    error: 'Troppe richieste, riprova più tardi'
  }
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In sviluppo, accetta tutte le origini
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In produzione, accetta solo domini specifici
    const allowedOrigins = [
      'https://adagiosevilla.github.io',
      'https://adagio-restaurant.netlify.app',
      'https://adagio-restaurant.vercel.app',
      'https://adagio-restaurant.onrender.com' // Dominio Render
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non consentito da CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
};

// Middleware
app.use(limiter); // Rate limiting generale
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (prima delle altre route)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server Adagio funzionante',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes con rate limiting specifico
app.use('/api/bookings', publicLimiter, bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', publicLimiter, newsletterRoutes);
app.use('/api/availability', availabilityRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Serve React app for all other routes (deve essere l'ultimo)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 404 handler - deve essere prima del global error handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint non trovato',
    path: req.path,
    method: req.method
  });
});

// Global error handler - deve essere l'ultimo middleware
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

const PORT = process.env.BACKEND_PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server Adagio avviato sulla porta ${PORT}`);
  console.log(`📊 API disponibili:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/bookings`);
  console.log(`   POST /api/bookings`);
  console.log(`   GET  /api/availability/:date`);
  console.log(`   GET  /api/reviews`);
  console.log(`   POST /api/newsletter/subscribe`);
  console.log(`   GET  /api/newsletter/emails`);
  console.log(`🌐 Frontend disponibile su http://localhost:${PORT}`);
});

module.exports = app;
